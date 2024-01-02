export const isEvent = (event: any): event is Event => {
  if (!event || typeof event !== "object") return false
  if ("content" in event && typeof event.content !== "object") return false
  return (
    "type" in event &&
    "event_id" in event &&
    "origin_server_ts" in event &&
    "room_id" in event &&
    typeof event.type === "string" &&
    typeof event.event_id === "string" &&
    typeof event.origin_server_ts === "number" &&
    typeof event.room_id === "string"
  )
}
