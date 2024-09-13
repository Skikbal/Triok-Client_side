import moment from "moment";
import none from "../assets/svgs/Remove.svg";
import high from "../assets/svgs/high-prority.svg";
import low from "../assets/svgs/low-prority.svg";
import medium from "../assets/svgs/medium-prority.svg";
import phone from "../assets/svgs/phone-call.svg";
import email from "../assets/svgs/send-email.svg";
import task from "../assets/svgs/task.svg";
import msg from "../assets/svgs/send-message.svg";
import plan from "../assets/svgs/smartplan.svg";

export const today = new Date();

export const monthOptions = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "Septemper" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const amPmOptions = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

export const leadSourceCategoryOptions = [
  { label: "Events", value: "Events" },
  { label: "Marketing", value: "" },
  { label: "Relationships", value: "Relationships" },
  { label: "Miscellaneous", value: "Miscellaneous" },
  { label: "Prospecting", value: "Prospecting" },
];

export const assignTimeOptions = [
  // { value: "Immediately", label: "Immediately" },
  { value: "Any Time", label: "Any Time" },
  { value: "Early Morning (4:00 AM-8:00 AM)", label: "Early Morning (4:00 AM-8:00 AM)" },
  { value: "Morning (8:00 AM-12:00 PM)", label: "Morning (8:00 AM-12:00 PM)" },
  { value: "Afternoon (12:00 PM-4:00 PM)", label: "Afternoon (12:00 PM-4:00 PM)" },
  { value: "Evening (4:00 PM-8:00 PM)", label: "Evening (4:00 PM-8:00 PM)" },
];

export const smartPlanOptions = [
  { value: "phone", label: "Phone Call", icon: phone },
  { value: "email", label: "Email", icon: email },
  { value: "task", label: "Task", icon: task },
  { value: "message", label: "Left Message", icon: msg },
  { value: "smartPlan", label: "TouchPlan", icon: plan },
];

export const roles = [
  { value: 1, label: "Super-Admin" },
  { value: 2, label: "Admin" },
  { value: 3, label: "Sales" },
];

export const phoneOptions = [
  { value: "mobile", label: "Mobile" },
  { value: "work", label: "Work" },
  { value: "fax", label: "Fax" },
];

export const emailOptions = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
];

export const addressOptions = [
  { value: "work", label: "Work" },
  { value: "home", label: "Home" },
];

export const linkOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "linkedIn", label: "LinkedIn" },
  { value: "website", label: "Website" },
  { value: "google_drive", label: "GoogleDrive" },
  // { value: "twitter", label: "Twitter" },
  // { value: "instagram", label: "Instagram" },
  // { value: "pinterest", label: "Pinterest" },
  // { value: "google+", label: "Google+" },
  // { value: "snapchat", label: "SnapChat" },
  // { value: "houzz", label: "Houzz" },
  // { value: "link", label: "Link" },
  // { value: "hi5", label: "hi5" },
  // { value: "mySpace", label: "MySpace" },
  // { value: "url", label: "Url" },
];

export const relationshipOptions = [
  { value: "business partner", label: "Business Partner" },
  { value: "spouse", label: "Spouse" },
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "child", label: "Child" },
  { value: "grandparent", label: "Grandparent" },
  { value: "grandchild", label: "Grandchild" },
  { value: "employer", label: "Employer" },
  { value: "employee", label: "Employee" },
  { value: "other", label: "Other" },

  // { value: "father", label: "Father" },
  // { value: "mother", label: "Mother" },
  // { value: "son", label: "Son" },
  // { value: "daughter", label: "Daughter" },
  // { value: "brother", label: "Brother" },
  // { value: "sister", label: "Sister" },
  // { value: "sibling of parent", label: "Sibling of Parent" },
  // { value: "child of sibling", label: "Child of Sibling" },
  // { value: "cousin", label: "Cousin" },
  // { value: "step sibling", label: "Step Sibling" },
  // { value: "step parent", label: "Step Parent" },
  // { value: "step child", label: "Step Child" },
  // { value: "sibling-in-law", label: "Sibling-in-law" },
  // { value: "parent-in-law", label: "Parent-in-law" },
  // { value: "child-in-law", label: "Child-in-law" },
  // { value: "partner", label: "Partner" },
];

export const filterTabData = [
  { label: "With", value: "with" },
  { label: "Without", value: "without" },
];

export const filterThreeTabData = [
  { label: "Date", value: "date" },
  { label: "Within Last", value: "within_last" },
  { label: "Longer Than", value: "longer_than" },
];

export const contactType = [
  { label: "All", value: "all" },
  { label: "Contacts Only", value: "contacts_only" },
  { label: "Leads Only", value: "leads_only" },
];

export const priorityOptions = [
  { label: "None", value: "none", icon: none, color: "#6F6F6F" },
  { label: "Low", value: "low", icon: low, color: "#FFB952" },
  { label: "High", value: "high", icon: high, color: "#FF0000" },
  { label: "Medium", value: "medium", icon: medium, color: "#3761E9" },
];

export const taskRepeatOptions = [
  { value: "does not repeat", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  {
    value: `weekly on ${moment(today).format("dddd")}`,
    label: `Weekly on ${moment(today).format("dddd")}`,
  },
  {
    value: `monthly on Second ${moment(today).format("dddd")}`,
    label: `Monthly on Second ${moment(today).format("dddd")}`,
  },
  {
    value: `yearly on ${moment(today).format("MMM Do")}`,
    label: `Yearly on ${moment(today).format("MMM Do")}`,
  },
  { value: "custom", label: "Custom" },
];

export const landlordOptions = [
  { value: "NNN", label: "NNN" },
  { value: "NN", label: "NN" },
  { value: "Gross", label: "Gross" },
  { value: "Roof & Structure", label: "Roof & Structure" },
  { value: "Ground", label: "Ground" },
  { value: "Leasehold", label: "Leasehold" },
];

export const activityOptions = [
  { value: "Conversation", label: "Phone Call" },
  { value: "Left Message", label: "Left Message" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
  { value: "Task", label: "Task" },
  // { value: "Note", label: "Note" },
  // { value: "Mail", label: "Mail" },
];

export const languageOptions = [{ label: "English", value: "english" }];

export const stateOptions = [
  { label: "Nationwide", value: "Nationwide" },
  { label: "AL", value: "AL" },
  { label: "AK", value: "AK" },
  { label: "AZ", value: "AZ" },
  { label: "AR", value: "AR" },
  { label: "AR", value: "AR" },
  { label: "CA", value: "CA" },
  { label: "CO", value: "CO" },
  { label: "CT", value: "CT" },
  { label: "DE", value: "DE" },
  { label: "DC", value: "DC" },
  { label: "FL", value: "FL" },
  { label: "GA", value: "GA" },
  { label: "GU", value: "GU" },
  { label: "HI", value: "HI" },
  { label: "ID", value: "ID" },
  { label: "IL", value: "IL" },
  { label: "IN", value: "IN" },
  { label: "IA", value: "IA" },
  { label: "KS", value: "KS" },
  { label: "KY", value: "KY" },
  { label: "LA", value: "LA" },
  { label: "ME", value: "ME" },
  { label: "MD", value: "MD" },
  { label: "MA", value: "MA" },
  { label: "MI", value: "MI" },
  { label: "MN", value: "MN" },
  { label: "MS", value: "MS" },
  { label: "MO", value: "MO" },
  { label: "MT", value: "MT" },
  { label: "NE", value: "NE" },
  { label: "NV", value: "NV" },
  { label: "NH", value: "NH" },
  { label: "NJ", value: "NJ" },
  { label: "NM", value: "NM" },
  { label: "NY", value: "NY" },
  { label: "NC", value: "NC" },
  { label: "ND", value: "ND" },
  { label: "MP", value: "MP" },
  { label: "OH", value: "OH" },
  { label: "OK", value: "OK" },
  { label: "OR", value: "OR" },
  { label: "PA", value: "PA" },
  { label: "PR", value: "PR" },
  { label: "RI", value: "RI" },
  { label: "SC", value: "SC" },
  { label: "SD", value: "SD" },
  { label: "TN", value: "TN" },
  { label: "TX", value: "TX" },
  { label: "TT", value: "TT" },
  { label: "UT", value: "UT" },
  { label: "VT", value: "VT" },
  { label: "VA", value: "VA" },
  { label: "VI", value: "VI" },
  { label: "WA", value: "WA" },
  { label: "WV", value: "WV" },
  { label: "WI", value: "WI" },
  { label: "WY", value: "WY" },
];

export const stateFullNameOptions = [
  { label: "Nationwide", value: "Nationwide" },
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "American Samoa", value: "AS" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "District of Columbia", value: "DC" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Guam", value: "GU" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Northern Mariana Islands", value: "MP" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Puerto Rico", value: "PR" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Trust Territories", value: "TT" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Virgin Islands", value: "VI" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];
