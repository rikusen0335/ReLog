import type { JobHistory } from "types/job"

const JobHistory: JobHistory = {
  firstName: "蒼士",
  lastName: "本間",
  firstNameKana: "そうし",
  lastNameKana: "ほんま",
  birthDate: new Date('2001-02-11').toISOString().split("T")[0],
  livingAt: "",
  finalEducation: "",
  skills: [],
  strength: "",
  histories: [],
}

export default function JobHistory() {
  return (
    <p>aaa</p>
  )
}