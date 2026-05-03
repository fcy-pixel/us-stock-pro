import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <AlertTriangle size={48} className="text-yellow-400 mx-auto" />
            <h1 className="text-xl font-bold text-white">載入失敗</h1>
            <p className="text-sm text-gray-400">{this.state.message || '發生未知錯誤'}</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg text-sm"
            >
              <RefreshCw size={14} /> 重新載入
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
