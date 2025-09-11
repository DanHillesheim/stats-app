import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/catalyst/button'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Input } from '../components/catalyst/input'
import { Calculator, BookOpen, Bot, TrendingUp, Sigma, ChartBar, ArrowRight, Sparkles, Brain } from 'lucide-react'

function HomePage() {
  const [meanInput, setMeanInput] = useState('')
  const [meanResult, setMeanResult] = useState(null)

  const calculateMean = () => {
    try {
      const numbers = meanInput.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      if (numbers.length > 0) {
        const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length
        setMeanResult(`Mean: ${mean.toFixed(2)} (n=${numbers.length})`)
      } else {
        setMeanResult('Please enter valid numbers')
      }
    } catch (error) {
      setMeanResult('Error calculating mean')
    }
  }

  return (
    <div className="mx-auto max-w-full">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Heading className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Welcome to Statistics Tutor
        </Heading>
        <Text className="mt-4 text-lg leading-8 text-gray-300">
          Your comprehensive statistics learning companion with AI-powered problem solving
        </Text>
      </div>

      {/* Three Column Tool Cards */}
      <div className="grid gap-8 lg:grid-cols-3 mb-12">
        {/* Cheatsheet Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative overflow-hidden rounded-2xl bg-gray-800 p-8 ring-1 ring-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <Subheading className="text-white">Interactive Cheatsheet</Subheading>
            </div>
            
            <Text className="text-gray-300 mb-6">
              Quick reference for statistical symbols, formulas, and concepts. Searchable and organized by topic.
            </Text>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="inline-flex items-center gap-x-1 rounded-full bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                <Sigma className="h-3 w-3" />
                Symbols
              </span>
              <span className="inline-flex items-center gap-x-1 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
                <TrendingUp className="h-3 w-3" />
                Formulas
              </span>
              <span className="inline-flex items-center gap-x-1 rounded-full bg-purple-400/10 px-3 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/20">
                <ChartBar className="h-3 w-3" />
                Examples
              </span>
            </div>
            
            <Button as={Link} to="/cheatsheet" className="w-full group/btn">
              Browse Cheatsheet
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* AI Solver Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative overflow-hidden rounded-2xl bg-gray-800 p-8 ring-1 ring-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Bot className="h-6 w-6 text-emerald-400" />
              </div>
              <Subheading className="text-white">AI Problem Solver</Subheading>
            </div>
            
            <Text className="text-gray-300 mb-6">
              Get step-by-step solutions powered by Grok AI. Perfect for homework and exam prep.
            </Text>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="inline-flex items-center gap-x-1 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-400/20">
                <Sparkles className="h-3 w-3" />
                Step-by-step
              </span>
              <span className="inline-flex items-center gap-x-1 rounded-full bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
                <Brain className="h-3 w-3" />
                Explanations
              </span>
            </div>
            
            <Button as={Link} to="/solver" color="green" className="w-full group/btn">
              Solve Problems
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Quick Calculator Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative overflow-hidden rounded-2xl bg-gray-800 p-8 ring-1 ring-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Calculator className="h-6 w-6 text-purple-400" />
              </div>
              <Subheading className="text-white">Quick Calculator</Subheading>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="mean-input" className="block text-sm font-medium text-white mb-1">
                  Calculate Mean
                </label>
                <Text className="text-xs text-gray-400 mb-3">
                  Enter numbers separated by commas
                </Text>
              </div>
              
              <Input
                id="mean-input"
                type="text"
                value={meanInput}
                onChange={(e) => setMeanInput(e.target.value)}
                placeholder="e.g., 1, 2, 3, 4, 5"
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
              />
              
              <Button onClick={calculateMean} outline className="w-full">
                Calculate
              </Button>
              
              {meanResult && (
                <div className="rounded-lg bg-gray-900/50 p-4 text-center ring-1 ring-white/10">
                  <Text className="text-sm font-semibold text-white">
                    {meanResult}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 lg:grid-cols-4 mb-12">
        <div className="rounded-xl bg-gray-800/50 p-6 ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <Text className="text-2xl font-bold text-white">25+</Text>
              <Text className="text-sm text-gray-400">Statistical Symbols</Text>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-gray-800/50 p-6 ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <Text className="text-2xl font-bold text-white">50+</Text>
              <Text className="text-sm text-gray-400">Formulas</Text>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-gray-800/50 p-6 ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <Text className="text-2xl font-bold text-white">AI</Text>
              <Text className="text-sm text-gray-400">Powered Solutions</Text>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-gray-800/50 p-6 ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Brain className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <Text className="text-2xl font-bold text-white">24/7</Text>
              <Text className="text-sm text-gray-400">Learning Support</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center border-t border-gray-800 pt-8">
        <Text className="text-sm text-gray-500">
          Built with React, Tailwind CSS v4, and Catalyst UI • Powered by Grok AI
        </Text>
      </div>
    </div>
  )
}

export default HomePage