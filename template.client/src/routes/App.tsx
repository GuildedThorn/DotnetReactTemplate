import { Forecast }  from "@/backend/types"
import {populateWeatherData} from "@/backend/api";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";

function App() {    
    const [forecasts, setForecasts] = useState<Forecast[]>();

    useEffect(() => {
        (async () => {
            let data = await populateWeatherData();
            setForecasts(data)
        })();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... If this continues, you might not be authorized or the server may be down. </em></p>
        :         <Table>
            <TableCaption>Weather Forecast</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Temp. (C)</TableHead>
                    <TableHead>Temp. (F)</TableHead>
                    <TableHead>Summary</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {forecasts.map((forecast, index) => (
                    <tr key={index}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                ))}
            </TableBody>
        </Table>;

    return (
        <div className="content-container flex flex-auto mx-4 my-4">
            <Card className={"w-[600px]"}>
                <CardHeader>
                    <CardTitle>Weather Forecast Test</CardTitle>
                    <CardDescription>An example API endpoint with authentication</CardDescription>
                </CardHeader>
                <CardContent>
                    {contents}
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
