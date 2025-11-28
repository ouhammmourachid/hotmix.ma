import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectCountry() {
  return (
    <Select>
      <SelectTrigger className="select_trigger">
        <SelectValue
          defaultValue="morocco"
          placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent className="select_content">
        <SelectGroup>
          <SelectItem value="morocco">Morocco</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function SelectCity() {
    return (
        <Select>
        <SelectTrigger className="select_trigger">
            <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent className="select_content">
            <SelectGroup>
            <SelectItem value="casablanca">Casablanca</SelectItem>
            <SelectItem value="rabat">Rabat</SelectItem>
            <SelectItem value="marrakech">Marrakech</SelectItem>
            </SelectGroup>
        </SelectContent>
        </Select>
    )
}
