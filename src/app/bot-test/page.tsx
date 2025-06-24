'use client'

import { useState } from 'react'

export default function BotTestPage() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testMessages = [
    "Set Kilden spotpris in NO1 to 0.59",
    "Set Cheap Energy fastpris in NO2 to 0.62", 
    "Sätt Kilden spot i NO3 till 0.58",
    "Set Kilden in NO1 to 0.59 and Cheap fastpris to 0.62",
    "Update Cheap Energy spotpris in NO4 to 0.65",
    "Set Cheap Energy spotpris in NO1 to -1.7",
    "Update Kilden fastpris in NO2 to -0.5"
  ]

  const handleTest = async (testMessage?: string) => {
    const messageToTest = testMessage || message
    if (!messageToTest.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToTest }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to test bot: ' + error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🤖 Telegram Bot Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Interface */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Bot Commands</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Custom Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Enter a message like: Set Kilden spotpris in NO1 to 0.59"
            />
          </div>
          
          <button
            onClick={() => handleTest()}
            disabled={loading || !message.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Custom Message'}
          </button>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Quick Test Examples:</h3>
            <div className="space-y-2">
              {testMessages.map((testMsg, index) => (
                <button
                  key={index}
                  onClick={() => handleTest(testMsg)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md text-sm disabled:opacity-50"
                >
                  {testMsg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          
          {result && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Original Message:</h3>
              <p className="text-sm bg-white p-2 rounded mb-4">{result.originalMessage}</p>
              
              {result.parsedCommands && result.parsedCommands.length > 0 && (
                <>
                  <h3 className="font-medium mb-2">Parsed Commands:</h3>
                  <pre className="text-sm bg-white p-2 rounded mb-4 overflow-auto">
                    {JSON.stringify(result.parsedCommands, null, 2)}
                  </pre>
                </>
              )}
              
              {result.validationResults && (
                <>
                  <h3 className="font-medium mb-2">Validation Results:</h3>
                  <pre className="text-sm bg-white p-2 rounded mb-4 overflow-auto">
                    {JSON.stringify(result.validationResults, null, 2)}
                  </pre>
                </>
              )}
              
              {result.updateResult && (
                <>
                  <h3 className="font-medium mb-2">Update Result:</h3>
                  <pre className="text-sm bg-white p-2 rounded mb-4 overflow-auto">
                    {JSON.stringify(result.updateResult, null, 2)}
                  </pre>
                </>
              )}
              
              {result.currentPrices && (
                <>
                  <h3 className="font-medium mb-2">Current Prices:</h3>
                  <pre className="text-sm bg-white p-2 rounded overflow-auto">
                    {result.currentPrices}
                  </pre>
                </>
              )}
              
              {result.error && (
                <div className="text-red-600 bg-red-50 p-2 rounded">
                  Error: {result.error}
                </div>
              )}
            </div>
          )}
          
          {!result && (
            <div className="bg-gray-50 p-4 rounded-md text-gray-500">
              No test results yet. Try testing a message above.
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h3 className="font-medium mb-2">📖 How to Use:</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Spot Price:</strong> "Set Kilden spotpris in NO1 to 0.59"</li>
          <li>• <strong>Fixed Price:</strong> "Set Cheap Energy fastpris in NO2 to 0.62"</li>
          <li>• <strong>Negative Price:</strong> "Set Cheap Energy spotpris in NO1 to -1.7"</li>
          <li>• <strong>All Plans:</strong> "Set Kilden in NO1 to 0.59" (updates both spot and fixed)</li>
          <li>• <strong>Norwegian:</strong> "Sett Kilden Kraft spot i NO2 til 0.58"</li>
          <li>• <strong>Swedish:</strong> "Sätt Cheap Energy fast i NO3 till 0.61"</li>
        </ul>
        
        <div className="mt-3 p-3 bg-yellow-50 rounded">
          <h4 className="font-medium text-yellow-800">💡 Plan Types:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>spotpris/spot</strong> - Updates only spot price plans</li>
            <li>• <strong>fastpris/fast/fixed</strong> - Updates only fixed price plans</li>
            <li>• <strong>omit plan type</strong> - Updates all plans for that supplier in that zone</li>
          </ul>
        </div>
        
        <div className="mt-3 p-3 bg-green-50 rounded">
          <h4 className="font-medium text-green-800">💰 Price Examples:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Positive:</strong> 0.59, 1.2, 69.9, 104.9</li>
            <li>• <strong>Negative:</strong> -1.7, -0.5, -2.1 (for discounts/rebates)</li>
            <li>• <strong>Decimals:</strong> Use . or , as decimal separator</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 