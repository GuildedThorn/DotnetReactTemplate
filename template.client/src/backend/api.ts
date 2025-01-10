

export async function populateWeatherData() {
    try {
        const response = await fetch('/api/WeatherForecast', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) new Error('Failed to fetch weather data');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}