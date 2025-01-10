import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"

function HardwareProcesses() {
    return (
        <div className="content-container">
            <Table>
                <TableCaption>ThornPC Processes</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Process ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Command</TableHead>
                        <TableHead>Threads</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Memory</TableHead>
                        <TableHead>CPU</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>2111</TableCell>
                        <TableCell>jetbrains-toolbox</TableCell>
                        <TableCell>./jetbrains-toolbox --w</TableCell>
                        <TableCell>43</TableCell>
                        <TableCell>thorn</TableCell>
                        <TableCell>232Mb</TableCell>
                        <TableCell>0.0%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>1916</TableCell>
                        <TableCell>btop</TableCell>
                        <TableCell>btop</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>thorn</TableCell>
                        <TableCell>8Mb</TableCell>
                        <TableCell>0.1%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>1857</TableCell>
                        <TableCell>qterminal</TableCell>
                        <TableCell>/usr/bin/qterminal</TableCell>
                        <TableCell>43</TableCell>
                        <TableCell>thorn</TableCell>
                        <TableCell>286Mb</TableCell>
                        <TableCell>0.9%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default HardwareProcesses;