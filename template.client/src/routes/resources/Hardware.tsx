import {type ChartConfig, ChartContainer} from "@/components/ui/chart";
import {Bar, BarChart} from "recharts";
import '../../index.css'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";

function HardwareResources() {

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    return (
        <div className="content-container">
            <Card>
                <CardHeader>
                    <CardTitle>Example Graphs</CardTitle>
                    <CardDescription>An example list of htop graphs for ThornNet</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default HardwareResources;