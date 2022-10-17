import React, { ErrorInfo } from 'react'

interface EBProps {
  children: React.ReactElement
  fallbackComponent?: React.ReactElement
}

interface EPState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<EBProps, EPState> {
  constructor(props: EBProps) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true, error }
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent
      }
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }

    // Return children components in case of no error

    return this.props.children
  }
}

export default ErrorBoundary
