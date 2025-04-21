import { Feedback } from "@/types";

export const mockFeedback: Feedback[] = [
  {
    id: "feedback-1",
    userId: "user-123",
    packageId: "mobile-standard",
    serviceRating: 4,
    appRating: 5,
    packageRating: 4,
    comment: "Great service overall. The app is very easy to use and the package meets my needs. Customer support was helpful when I had questions.",
    date: "2023-06-20T14:30:00Z",
  },
  {
    id: "feedback-2",
    userId: "user-123",
    packageId: "broadband-fast",
    serviceRating: 3,
    appRating: 4,
    packageRating: 3,
    comment: "The broadband speed is good but sometimes drops during peak hours. The app is well designed and makes it easy to track my usage.",
    date: "2023-05-25T10:15:00Z",
  },
  {
    id: "feedback-3",
    userId: "user-456",
    packageId: "tv-entertainment",
    serviceRating: 5,
    appRating: 4,
    packageRating: 5,
    comment: "Love the TV package! Great selection of channels and the streaming quality is excellent. The app could use some improvements in the TV guide section.",
    date: "2023-07-05T16:45:00Z",
  },
  {
    id: "feedback-4",
    userId: "user-789",
    packageId: "bundle-complete",
    serviceRating: 4,
    appRating: 3,
    packageRating: 4,
    comment: "The bundle offers great value for money. All services work well together. The app is functional but could be more intuitive.",
    date: "2023-06-30T09:20:00Z",
  },
];