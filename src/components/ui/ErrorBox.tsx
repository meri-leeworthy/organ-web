export function ErrorBox({ error }: { error: Error | string }) {
  const stringError = typeof error === "string" ? error : error.message

  return stringError ? (
    <div className="p-2 mb-2 text-xs text-red-600 border border-red-300 border-dashed bg-red-50">
      Error 😓 {stringError}
    </div>
  ) : null
}
