import { type JobHistory, SkillKind } from "types/job"

const JobHistory: JobHistory = {
  firstName: "蒼士",
  lastName: "本間",
  firstNameKana: "そうし",
  lastNameKana: "ほんま",
  birthDate: new Date('2001-02-11').toISOString().split("T")[0],
  livingAt: "神奈川県",
  finalEducation: "北海道情報専門学校　卒業",
  skills: [
    { kind: SkillKind.OS, name: "macOS", level: "advanced" },
  ],
  strength: "",
  histories: [],
}

export default function JobHistory() {
  return (
    <p>aaa</p>
  )
}