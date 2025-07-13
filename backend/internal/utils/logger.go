package utils

import (
	"fmt"
	"time"
)

// FormatLogEntry formats log entries for the application
func FormatLogEntry(timestamp time.Time, statusCode int, latency time.Duration, clientIP, method, path, errorMessage string) string {
	return fmt.Sprintf("[%s] %s %d %s %s %s %s\n",
		timestamp.Format("2006/01/02 - 15:04:05"),
		clientIP,
		statusCode,
		latency,
		method,
		path,
		errorMessage,
	)
}
