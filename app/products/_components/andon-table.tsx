import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table"

export default function ManufacturingMetricsTable() {
  const data = [
    { metric: "Man Hour", w36: "6.236", w37: "7.905", w38: "10.127", w39: "10314" },
    { metric: "Andon", w36: "2529", w37: "1560", w38: "1654", w39: "1384" },
    { metric: "Andon Stop Qty", w36: "88", w37: "51", w38: "56", w39: "91" },
    { metric: "Target", w36: "2.00%", w37: "2.00%", w38: "2.00%", w39: "2.00%" },
    { metric: "Instant Stop Rate", w36: "68%", w37: "33%", w38: "27%", w39: "22%" },
    { metric: "Achievement Rate", w36: "66%", w37: "84%", w38: "86%", w39: "89%" },
  ]

  return (
    <div className="p-4">
      <Table className="border-collapse border border-border">
        <TableHeader>
          <TableRow>
            <TableHead className="border border-border bg-primary text-primary-foreground font-bold"></TableHead>
            {["W36", "W37", "W38", "W39"].map((week) => (
              <TableHead key={week} className="border border-border bg-primary text-primary-foreground font-bold text-center">
                {week}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.metric}>
              <TableCell className="border border-border font-medium">{row.metric}</TableCell>
              <TableCell className="border border-border text-center">{row.w36}</TableCell>
              <TableCell className="border border-border text-center">{row.w37}</TableCell>
              <TableCell className="border border-border text-center">{row.w38}</TableCell>
              <TableCell className="border border-border text-center">{row.w39}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}