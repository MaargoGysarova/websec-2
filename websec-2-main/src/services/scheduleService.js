const XMLHttpRequest = require('xhr2');

class ScheduleService {
    fetchSchedule(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            const targetUrl = "https://ssau.ru" + url;
            
            let timeout = setTimeout(() => {
                request.abort();
                reject(new Error('Request timeout'));
            }, 10000); // 10 second timeout

            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    clearTimeout(timeout);
                    if (request.status === 200) {
                        try {
                            // Проверяем, что ответ действительно HTML
                            if (request.responseText.trim().startsWith('<!DOCTYPE html>') || 
                                request.responseText.trim().startsWith('<html')) {
                                resolve(request.responseText);
                            } else {
                                reject(new Error('Invalid response format'));
                            }
                        } catch (error) {
                            reject(new Error('Failed to process response'));
                        }
                    } else {
                        reject(new Error(`Failed to fetch schedule: ${request.status}`));
                    }
                }
            };

            request.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Network error occurred'));
            };

            request.open("GET", targetUrl, true);
            request.setRequestHeader('Accept', 'text/html');
            request.setRequestHeader('Cache-Control', 'no-cache');
            request.send(null);
        });
    }
}

module.exports = new ScheduleService();
