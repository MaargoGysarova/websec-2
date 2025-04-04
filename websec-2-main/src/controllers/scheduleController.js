const HTMLParser = require('node-html-parser');
const scheduleService = require('../services/scheduleService');

class ScheduleController {
    async getSchedule(req, res) {
        const requestType = req.query.staffId ? 'teacher' : 'group';
        try {
            console.log(`Processing ${requestType} schedule request`); // Debug log
            const scheduleData = await scheduleService.fetchSchedule(req.url);
            if (!scheduleData) {
                throw new Error('No schedule data received');
            }
            const parsedSchedule = this.parseScheduleData(scheduleData, requestType);
            if (!parsedSchedule || !parsedSchedule.date || !parsedSchedule.time) {
                throw new Error('Invalid schedule data format');
            }
            console.log('Parsed schedule:', parsedSchedule); // Debug log
            res.json(parsedSchedule);
        } catch (error) {
            console.error('Error in getSchedule:', error);
            res.status(500).json({ 
                error: 'Failed to fetch schedule data',
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    parseScheduleData(htmlContent, requestType = 'group') {
        console.log('Parsing HTML content...'); // Debug log
        if (!htmlContent) {
            throw new Error('Empty HTML content');
        }

        const schedule = {
            date: [],
            daySchedule: [],
            time: [],
            currentWeek: 1,
            selectedGroup: '',
            selectedTeacher: ''
        };

        const html = HTMLParser.parse(htmlContent);
        if (!html) {
            throw new Error('Failed to parse HTML content');
        }

        try {
            // Parse schedule items
            const scheduleItems = html.querySelectorAll(".schedule__item");
            if (!scheduleItems || scheduleItems.length === 0) {
                throw new Error('No schedule items found');
            }

            console.log('Found schedule items:', scheduleItems.length); // Debug log
            
            // Get dates first
            const dateElements = html.querySelectorAll(".schedule__head");
            if (dateElements && dateElements.length > 0) {
                dateElements.forEach(cell => {
                    if (cell.childNodes && cell.childNodes.length >= 2) {
                        const date = cell.childNodes[0].innerText.trim() + ' ' + cell.childNodes[1].innerText.trim();
                        schedule.date.push(date);
                    }
                });
            } else {
                console.log('No date elements found'); // Debug log
                throw new Error('No date elements found in schedule');
            }

            scheduleItems.forEach(cell => {
                if (cell.querySelector(".schedule__discipline")) {
                    const cellGroups = this.parseGroups(cell);
                    schedule.daySchedule.push(this.parseScheduleItem(cell, cellGroups));
                } else if (html.querySelectorAll(".schedule__item + .schedule__head").length && !schedule.date.length) {
                    html.querySelectorAll(".schedule__item + .schedule__head").forEach(cell => {
                        if (cell.childNodes && cell.childNodes.length >= 2) {
                            schedule.date.push(cell.childNodes[0].innerText + cell.childNodes[1].innerText);
                        }
                    });
                } else {
                    schedule.daySchedule.push({ subject: null });
                }
            });

            // Parse time slots
            html.querySelectorAll(".schedule__time").forEach(cell => {
                if (cell.childNodes && cell.childNodes.length >= 2) {
                    schedule.time.push(cell.childNodes[0].innerText + cell.childNodes[1].innerText);
                }
            });

            const titleElement = html.querySelector(".info-block__title");
            if (titleElement) {
                const titleText = titleElement.innerText.trim();
                if (requestType === 'teacher') {
                    schedule.selectedTeacher = titleText;
                    schedule.selectedGroup = '';
                } else {
                    schedule.selectedGroup = titleText;
                    schedule.selectedTeacher = '';
                }
                console.log(`Selected ${requestType}:`, titleText); // Debug log
            }
            schedule.currentWeek = html.querySelector(".week-nav-current_week")?.innerText || '1';
            schedule.daySchedule = schedule.daySchedule.slice(6, schedule.daySchedule.length);

            return schedule;
        } catch (error) {
            console.error('Error parsing schedule data:', error);
            throw error;
        }
    }

    parseGroups(cell) {
        const cellGroups = [];
        if (cell.querySelectorAll(".schedule__group").length) {
            cell.querySelectorAll(".schedule__group").forEach(group => {
                if (group.innerText.trim() !== "") {
                    cellGroups.push(JSON.stringify({
                        name: group.innerText,
                        link: group.getAttribute("href") ?? null
                    }));
                } else {
                    cellGroups.push(JSON.stringify({
                        name: "",
                        link: null
                    }));
                }
            });
        }
        return cellGroups;
    }

    parseScheduleItem(cell, cellGroups) {
        if (!cell) {
            throw new Error('Empty cell in parseScheduleItem');
        }

        const disciplineElement = cell.querySelector(".schedule__discipline");
        const placeElement = cell.querySelector(".schedule__place");
        const teacher = cell.querySelector(".schedule__teacher > .caption-text");

        if (!disciplineElement || !placeElement) {
            throw new Error('Missing required schedule elements');
        }

        return {
            subject: disciplineElement.innerText.trim(),
            place: placeElement.innerText.trim(),
            teacher: JSON.stringify(teacher === null ? {
                name: "",
                link: null,
            } : {
                name: (teacher.innerText || "").trim(),
                link: teacher.getAttribute("href")
            }),
            groups: cellGroups
        };
    }
}

module.exports = new ScheduleController();
