import React, { useState, useEffect } from 'react'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Textarea } from '../components/catalyst/textarea'
import { Input } from '../components/catalyst/input'
import { Button } from '../components/catalyst/button'
import { Alert, AlertActions, AlertDescription, AlertTitle } from '../components/SimpleAlert'
import { Bot, Send, History, Key, Sparkles, Copy, RotateCcw, Save } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

function SolverPage() {
  const [problem, setProblem] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [solution, setSolution] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)

  useEffect(() => {
    // Check if we're in production (Cloudflare Workers)
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    
    if (isProduction) {
      // In production, we use the proxy endpoint, no need for client-side API key
      setShowApiKeyDialog(false)
    } else {
      // In development, check for API key
      const envKey = import.meta.env.VITE_GROK_API_KEY
      if (envKey && envKey !== 'your_api_key_here' && envKey !== '') {
        setApiKey(envKey)
      } else {
        // Fall back to localStorage
        const savedKey = localStorage.getItem('grok-api-key')
        if (savedKey) {
          setApiKey(savedKey)
        } else {
          setShowApiKeyDialog(true)
        }
      }
    }

    const savedHistory = localStorage.getItem('problem-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveApiKey = () => {
    localStorage.setItem('grok-api-key', apiKey)
    setShowApiKeyDialog(false)
  }

  const solveProblem = async () => {
    if (!problem.trim()) {
      setError('Please enter a problem to solve')
      return
    }

    // Check if we're in production (Cloudflare Workers)
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    
    // In production, use the proxy endpoint; in development, check for API key
    if (!isProduction && !apiKey) {
      setShowApiKeyDialog(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let response;
      
      if (isProduction) {
        // Use the Worker proxy endpoint in production
        response = await fetch('/api/grok', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: import.meta.env.VITE_GROK_MODEL || 'grok-4-latest',
            messages: [
              {
                role: 'system',
                content: 'You are a statistics tutor. Provide step-by-step solutions with clear explanations and formulas. Use LaTeX notation for mathematical expressions (wrap inline math in $ and block math in $$). Structure your response with clear sections: Solution, Explanation, and Final Answer.'
              },
              {
                role: 'user',
                content: `Solve this statistics problem step-by-step: ${problem}`
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        })
      } else {
        // Use direct API call in development
        const apiEndpoint = import.meta.env.VITE_GROK_API_ENDPOINT || 'https://api.x.ai/v1/chat/completions'
        const model = import.meta.env.VITE_GROK_MODEL || 'grok-4-latest'
        
        response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are a statistics tutor. Provide step-by-step solutions with clear explanations and formulas. Use LaTeX notation for mathematical expressions (wrap inline math in $ and block math in $$). Structure your response with clear sections: Solution, Explanation, and Final Answer.'
              },
              {
                role: 'user',
                content: `Solve this statistics problem step-by-step: ${problem}`
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        })
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      const solutionText = data.choices[0].message.content
      
      setSolution(solutionText)
      
      const newHistoryItem = {
        problem,
        solution: solutionText,
        timestamp: new Date().toISOString()
      }
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10)
      setHistory(updatedHistory)
      localStorage.setItem('problem-history', JSON.stringify(updatedHistory))
      
    } catch (err) {
      setError(`Failed to solve problem: ${err.message}. Please check your API key and try again.`)
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadFromHistory = (item) => {
    setProblem(item.problem)
    setSolution(item.solution)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const renderSolution = (text) => {
    if (!text) return null

    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2)
        return <BlockMath key={index} math={math} />
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1)
        return <InlineMath key={index} math={math} />
      } else {
        return <span key={index} className="whitespace-pre-wrap">{part}</span>
      }
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Heading className="text-3xl font-bold mb-2">AI Problem Solver</Heading>
        <Text className="text-slate-600 dark:text-slate-400">
          Get step-by-step solutions to statistics problems powered by Grok AI
        </Text>
      </div>

      {showApiKeyDialog && (
        <Alert color="amber" className="mb-6">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <AlertTitle>API Key Required</AlertTitle>
              <AlertDescription>
                To use the AI solver, you need a Grok API key. Get one at{' '}
                <a href="https://x.ai/api" target="_blank" rel="noopener noreferrer" className="font-medium text-amber-900 underline hover:no-underline dark:text-amber-400">
                  x.ai/api
                </a>
              </AlertDescription>
              <AlertActions>
                <div className="mt-4 flex gap-3">
                  <Input
                    type="password"
                    placeholder="Enter your Grok API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={saveApiKey}>
                    Save Key
                  </Button>
                </div>
              </AlertActions>
            </div>
          </div>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10">
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="problem-input" className="block text-sm font-medium text-slate-950 dark:text-white">
                    Enter Your Statistics Problem
                  </label>
                  <Text className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Describe your problem in detail for the best solution
                  </Text>
                </div>
                <Textarea
                  id="problem-input"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Example: Calculate the 95% confidence interval for a sample mean of 50, standard deviation of 10, and sample size of 25."
                  rows={5}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={solveProblem} 
                  disabled={isLoading}
                  color="green"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Solving...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Solve Problem
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => {
                    setProblem('')
                    setSolution(null)
                    setError(null)
                  }}
                  outline
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </Button>
              </div>

            {error && (
              <Alert color="rose" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

              {solution && (
                <div className="mt-6 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 ring-1 ring-blue-500/10 dark:from-slate-800 dark:to-slate-800 dark:ring-blue-500/20">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                        <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Subheading>Solution</Subheading>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(solution)}
                      outline
                      className="text-sm"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {renderSolution(solution)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg bg-blue-50 p-4 ring-1 ring-blue-500/10 dark:bg-blue-500/10 dark:ring-blue-500/20 sm:p-6">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Example Problems to Try:</h3>
            <div className="mt-3 space-y-2">
              <button
                className="block w-full rounded-md p-2 text-left text-sm hover:bg-white/50 dark:hover:bg-slate-800/50"
                onClick={() => setProblem('A sample of 36 students has a mean score of 75 with a standard deviation of 12. Calculate the 95% confidence interval for the population mean.')}
              >
                <span className="font-medium text-slate-950 dark:text-white">Confidence Interval</span>
                <Text className="text-xs text-slate-600 dark:text-slate-400">Calculate CI for population mean</Text>
              </button>
              <button
                className="block w-full rounded-md p-2 text-left text-sm hover:bg-white/50 dark:hover:bg-slate-800/50"
                onClick={() => setProblem('Test if the mean height of a population differs from 170cm. Sample: n=25, mean=173cm, s=8cm. Use α=0.05.')}
              >
                <span className="font-medium text-slate-950 dark:text-white">Hypothesis Testing</span>
                <Text className="text-xs text-slate-600 dark:text-slate-400">One-sample t-test</Text>
              </button>
              <button
                className="block w-full rounded-md p-2 text-left text-sm hover:bg-white/50 dark:hover:bg-slate-800/50"
                onClick={() => setProblem('Calculate the correlation coefficient for: X=[1,2,3,4,5], Y=[2,4,5,4,5]')}
              >
                <span className="font-medium text-slate-950 dark:text-white">Correlation Analysis</span>
                <Text className="text-xs text-slate-600 dark:text-slate-400">Calculate Pearson's r</Text>
              </button>
              <button
                className="block w-full rounded-md p-2 text-left text-sm hover:bg-white/50 dark:hover:bg-slate-800/50"
                onClick={() => setProblem('A die is rolled 60 times. We get: 1(8 times), 2(12 times), 3(10 times), 4(15 times), 5(7 times), 6(8 times). Test if the die is fair using chi-square test.')}
              >
                <span className="font-medium text-slate-950 dark:text-white">Chi-square Test</span>
                <Text className="text-xs text-slate-600 dark:text-slate-400">Goodness of fit test</Text>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10">
            <div className="p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <History className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <Subheading>Recent Problems</Subheading>
              </div>
              
              {history.length === 0 ? (
                <Text className="text-sm text-slate-500">No problems solved yet</Text>
              ) : (
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <button
                      key={index}
                      className="w-full rounded-md bg-slate-50 p-3 text-left hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                      onClick={() => loadFromHistory(item)}
                    >
                      <Text className="text-sm font-medium text-slate-950 line-clamp-2 dark:text-white">
                        {item.problem}
                      </Text>
                      <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </Text>
                    </button>
                  ))}
                </div>
              )}
              
              {history.length > 0 && (
                <Button
                  onClick={() => {
                    setHistory([])
                    localStorage.removeItem('problem-history')
                  }}
                  outline
                  className="mt-4 w-full text-sm"
                >
                  Clear History
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-amber-50 p-4 ring-1 ring-amber-500/10 dark:bg-amber-500/10 dark:ring-amber-500/20 sm:p-6">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              Tips for Better Results
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="text-amber-600 dark:text-amber-400">•</span>
                <span>Be specific about what you need to calculate</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 dark:text-amber-400">•</span>
                <span>Include all given values and parameters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 dark:text-amber-400">•</span>
                <span>Specify significance levels for tests (e.g., α=0.05)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 dark:text-amber-400">•</span>
                <span>Mention if you need visualizations described</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 dark:text-amber-400">•</span>
                <span>Ask for step-by-step explanations when needed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolverPage