import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Input } from '../components/catalyst/input'
import { Button } from '../components/catalyst/button'
import { Alert, AlertDescription, AlertTitle } from '../components/SimpleAlert'
import { Calculator, ArrowLeft, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

// Formula configurations with steps and calculations
const formulas = {
  'mean': {
    name: 'Mean (Average)',
    symbol: 'x̄',
    formula: '\\bar{x} = \\frac{\\sum x_i}{n}',
    description: 'Calculate the average of a dataset',
    steps: [
      {
        id: 'values',
        label: 'Enter your data values',
        type: 'array',
        placeholder: 'Enter values separated by commas (e.g., 10, 20, 30)',
        hint: 'These are the individual data points you want to average',
        example: 'Example dataset: 23, 45, 67, 89, 12, 34, 56',
        helpText: 'Enter each number separated by a comma. You can paste data from a spreadsheet.'
      }
    ],
    calculate: (inputs) => {
      // Handle multiple delimiters: comma, space, newline, tab
      const values = inputs.values
        .split(/[\s,\n\t]+/)
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v))
      if (values.length === 0) throw new Error('Please enter valid numbers')
      const sum = values.reduce((a, b) => a + b, 0)
      const mean = sum / values.length
      return {
        result: mean.toFixed(4),
        steps: [
          { label: 'Data values', value: values.join(', ') },
          { label: 'Sum of values', value: `Σx = ${sum}` },
          { label: 'Number of values', value: `n = ${values.length}` },
          { label: 'Mean', value: `x̄ = ${sum}/${values.length} = ${mean.toFixed(4)}` }
        ]
      }
    }
  },
  'std-dev': {
    name: 'Standard Deviation',
    symbol: 'σ',
    formula: '\\sigma = \\sqrt{\\frac{\\sum (x_i - \\mu)^2}{N}}',
    description: 'Measure the spread of data around the mean',
    steps: [
      {
        id: 'values',
        label: 'Enter your data values',
        type: 'array',
        placeholder: 'Enter values separated by commas (e.g., 10, 20, 30)',
        hint: 'The dataset you want to analyze',
        example: 'Example: Test scores: 85, 92, 78, 95, 88, 79, 83',
        helpText: 'Paste from Excel or enter numbers separated by commas, spaces, or line breaks'
      },
      {
        id: 'type',
        label: 'Population or Sample?',
        type: 'select',
        options: [
          { value: 'population', label: 'Population (σ)' },
          { value: 'sample', label: 'Sample (s)' }
        ],
        hint: 'Use sample if your data is a subset of a larger population'
      }
    ],
    calculate: (inputs) => {
      // Handle multiple delimiters: comma, space, newline, tab
      const values = inputs.values
        .split(/[\s,\n\t]+/)
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v))
      if (values.length === 0) throw new Error('Please enter valid numbers')
      
      const n = values.length
      const mean = values.reduce((a, b) => a + b, 0) / n
      const squaredDiffs = values.map(x => Math.pow(x - mean, 2))
      const sumSquaredDiffs = squaredDiffs.reduce((a, b) => a + b, 0)
      const divisor = inputs.type === 'sample' ? n - 1 : n
      const variance = sumSquaredDiffs / divisor
      const stdDev = Math.sqrt(variance)
      
      return {
        result: stdDev.toFixed(4),
        steps: [
          { label: 'Data values', value: values.join(', ') },
          { label: 'Mean', value: `μ = ${mean.toFixed(4)}` },
          { label: 'Squared differences', value: `Σ(x - μ)² = ${sumSquaredDiffs.toFixed(4)}` },
          { label: 'Divisor', value: `${inputs.type === 'sample' ? 'n - 1' : 'N'} = ${divisor}` },
          { label: 'Variance', value: `σ² = ${variance.toFixed(4)}` },
          { label: 'Standard Deviation', value: `${inputs.type === 'sample' ? 's' : 'σ'} = ${stdDev.toFixed(4)}` }
        ]
      }
    }
  },
  'confidence-interval': {
    name: 'Confidence Interval',
    symbol: 'CI',
    formula: '\\bar{x} \\pm z \\cdot \\frac{\\sigma}{\\sqrt{n}}',
    description: 'Calculate the confidence interval for a population mean',
    steps: [
      {
        id: 'mean',
        label: 'Sample Mean (x̄)',
        type: 'number',
        placeholder: 'e.g., 75.5',
        hint: 'The average of your sample data'
      },
      {
        id: 'stdDev',
        label: 'Standard Deviation (σ or s)',
        type: 'number',
        placeholder: 'e.g., 10.2',
        hint: 'The spread of your data'
      },
      {
        id: 'sampleSize',
        label: 'Sample Size (n)',
        type: 'number',
        placeholder: 'e.g., 30',
        hint: 'Number of observations in your sample'
      },
      {
        id: 'confidence',
        label: 'Confidence Level',
        type: 'select',
        options: [
          { value: '90', label: '90% (z = 1.645)' },
          { value: '95', label: '95% (z = 1.96)' },
          { value: '99', label: '99% (z = 2.576)' }
        ],
        hint: 'How confident you want to be in your interval'
      }
    ],
    calculate: (inputs) => {
      const mean = parseFloat(inputs.mean)
      const stdDev = parseFloat(inputs.stdDev)
      const n = parseInt(inputs.sampleSize)
      
      if (isNaN(mean) || isNaN(stdDev) || isNaN(n)) {
        throw new Error('Please enter valid numbers')
      }
      
      const zScores = { '90': 1.645, '95': 1.96, '99': 2.576 }
      const z = zScores[inputs.confidence]
      const standardError = stdDev / Math.sqrt(n)
      const marginOfError = z * standardError
      const lowerBound = mean - marginOfError
      const upperBound = mean + marginOfError
      
      return {
        result: `[${lowerBound.toFixed(4)}, ${upperBound.toFixed(4)}]`,
        steps: [
          { label: 'Sample Mean', value: `x̄ = ${mean}` },
          { label: 'Standard Deviation', value: `σ = ${stdDev}` },
          { label: 'Sample Size', value: `n = ${n}` },
          { label: 'Z-score', value: `z = ${z}` },
          { label: 'Standard Error', value: `SE = σ/√n = ${stdDev}/√${n} = ${standardError.toFixed(4)}` },
          { label: 'Margin of Error', value: `ME = z × SE = ${z} × ${standardError.toFixed(4)} = ${marginOfError.toFixed(4)}` },
          { label: 'Confidence Interval', value: `${mean} ± ${marginOfError.toFixed(4)} = [${lowerBound.toFixed(4)}, ${upperBound.toFixed(4)}]` }
        ]
      }
    }
  },
  'z-score': {
    name: 'Z-Score',
    symbol: 'z',
    formula: 'z = \\frac{x - \\mu}{\\sigma}',
    description: 'Standardize a value to see how many standard deviations it is from the mean',
    steps: [
      {
        id: 'value',
        label: 'Value (x)',
        type: 'number',
        placeholder: 'e.g., 85',
        hint: 'The value you want to standardize'
      },
      {
        id: 'mean',
        label: 'Population Mean (μ)',
        type: 'number',
        placeholder: 'e.g., 75',
        hint: 'The average of the population'
      },
      {
        id: 'stdDev',
        label: 'Population Standard Deviation (σ)',
        type: 'number',
        placeholder: 'e.g., 10',
        hint: 'The spread of the population'
      }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.value)
      const mean = parseFloat(inputs.mean)
      const stdDev = parseFloat(inputs.stdDev)
      
      if (isNaN(x) || isNaN(mean) || isNaN(stdDev)) {
        throw new Error('Please enter valid numbers')
      }
      
      const zScore = (x - mean) / stdDev
      const interpretation = zScore > 0 
        ? `${Math.abs(zScore).toFixed(2)} standard deviations above the mean`
        : zScore < 0 
        ? `${Math.abs(zScore).toFixed(2)} standard deviations below the mean`
        : 'exactly at the mean'
      
      return {
        result: zScore.toFixed(4),
        steps: [
          { label: 'Value', value: `x = ${x}` },
          { label: 'Mean', value: `μ = ${mean}` },
          { label: 'Standard Deviation', value: `σ = ${stdDev}` },
          { label: 'Calculation', value: `z = (${x} - ${mean})/${stdDev}` },
          { label: 'Z-Score', value: zScore.toFixed(4) },
          { label: 'Interpretation', value: interpretation }
        ]
      }
    }
  },
  't-statistic': {
    name: 'T-Statistic',
    symbol: 't',
    formula: 't = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}',
    description: 'Calculate the t-statistic for hypothesis testing',
    steps: [
      {
        id: 'sampleMean',
        label: 'Sample Mean (x̄)',
        type: 'number',
        placeholder: 'e.g., 52.5',
        hint: 'The average of your sample'
      },
      {
        id: 'hypothesizedMean',
        label: 'Hypothesized Mean (μ₀)',
        type: 'number',
        placeholder: 'e.g., 50',
        hint: 'The mean value in your null hypothesis'
      },
      {
        id: 'sampleStdDev',
        label: 'Sample Standard Deviation (s)',
        type: 'number',
        placeholder: 'e.g., 5.2',
        hint: 'The spread of your sample data'
      },
      {
        id: 'sampleSize',
        label: 'Sample Size (n)',
        type: 'number',
        placeholder: 'e.g., 25',
        hint: 'Number of observations in your sample'
      }
    ],
    calculate: (inputs) => {
      const xBar = parseFloat(inputs.sampleMean)
      const mu0 = parseFloat(inputs.hypothesizedMean)
      const s = parseFloat(inputs.sampleStdDev)
      const n = parseInt(inputs.sampleSize)
      
      if (isNaN(xBar) || isNaN(mu0) || isNaN(s) || isNaN(n)) {
        throw new Error('Please enter valid numbers')
      }
      
      const standardError = s / Math.sqrt(n)
      const tStat = (xBar - mu0) / standardError
      const df = n - 1
      
      return {
        result: tStat.toFixed(4),
        steps: [
          { label: 'Sample Mean', value: `x̄ = ${xBar}` },
          { label: 'Hypothesized Mean', value: `μ₀ = ${mu0}` },
          { label: 'Sample Std Dev', value: `s = ${s}` },
          { label: 'Sample Size', value: `n = ${n}` },
          { label: 'Standard Error', value: `SE = s/√n = ${s}/√${n} = ${standardError.toFixed(4)}` },
          { label: 'T-Statistic', value: `t = (${xBar} - ${mu0})/${standardError.toFixed(4)} = ${tStat.toFixed(4)}` },
          { label: 'Degrees of Freedom', value: `df = n - 1 = ${df}` }
        ]
      }
    }
  }
}

function FormulaCalculatorPage() {
  const { formulaId } = useParams()
  const [inputs, setInputs] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  
  const formula = formulas[formulaId]
  
  useEffect(() => {
    // Reset state when formula changes
    setInputs({})
    setResult(null)
    setError(null)
    setCurrentStep(0)
  }, [formulaId])
  
  if (!formula) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert color="rose">
          <AlertTitle>Formula Not Found</AlertTitle>
          <AlertDescription>
            The formula calculator you're looking for doesn't exist.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link to="/cheatsheet">
            <Button outline>
              <ArrowLeft className="h-4 w-4" />
              Back to Cheatsheet
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  const handleInputChange = (stepId, value) => {
    setInputs(prev => ({ ...prev, [stepId]: value }))
    setError(null)
  }
  
  const handleCalculate = () => {
    try {
      const calculationResult = formula.calculate(inputs)
      setResult(calculationResult)
      setError(null)
    } catch (err) {
      setError(err.message)
      setResult(null)
    }
  }
  
  const isStepComplete = (step) => {
    return inputs[step.id] && inputs[step.id].length > 0
  }
  
  const allStepsComplete = formula.steps.every(step => isStepComplete(step))
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/cheatsheet" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Cheatsheet
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
            <Calculator className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <Heading className="text-3xl font-bold mb-2">{formula.name} Calculator</Heading>
            <Text className="text-slate-600 dark:text-slate-400">{formula.description}</Text>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10">
            <div className="p-6">
              <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <Subheading className="text-sm mb-2">Formula:</Subheading>
                <BlockMath math={formula.formula} />
              </div>
              
              <div className="space-y-6">
                <Subheading>Enter Your Data</Subheading>
                
                {formula.steps.map((step, index) => (
                  <div key={step.id} className={`p-4 rounded-lg border-2 transition-colors ${
                    currentStep === index 
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' 
                      : isStepComplete(step)
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-500/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm">
                        {isStepComplete(step) ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1">
                          {step.label}
                        </label>
                        {step.hint && (
                          <Text className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                            <Lightbulb className="inline h-3 w-3 mr-1" />
                            {step.hint}
                          </Text>
                        )}
                        {step.type === 'select' ? (
                          <select
                            value={inputs[step.id] || ''}
                            onChange={(e) => handleInputChange(step.id, e.target.value)}
                            onFocus={() => setCurrentStep(index)}
                            className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          >
                            <option value="">Select an option</option>
                            {step.options.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : step.type === 'array' ? (
                          <div className="space-y-2">
                            <textarea
                              value={inputs[step.id] || ''}
                              onChange={(e) => handleInputChange(step.id, e.target.value)}
                              onFocus={() => setCurrentStep(index)}
                              placeholder={step.placeholder}
                              rows={3}
                              className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2"
                            />
                            {step.example && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {step.example}
                              </div>
                            )}
                            {step.helpText && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                💡 {step.helpText}
                              </div>
                            )}
                            {inputs[step.id] && (
                              <div className="text-xs text-green-600 dark:text-green-400">
                                ✓ Detected {inputs[step.id].split(/[\s,\n\t]+/).filter(v => v.trim() && !isNaN(parseFloat(v))).length} valid numbers
                              </div>
                            )}
                          </div>
                        ) : (
                          <Input
                            type={step.type === 'number' ? 'number' : 'text'}
                            value={inputs[step.id] || ''}
                            onChange={(e) => handleInputChange(step.id, e.target.value)}
                            onFocus={() => setCurrentStep(index)}
                            placeholder={step.placeholder}
                            className="w-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={handleCalculate}
                  disabled={!allStepsComplete}
                  color="green"
                >
                  <Calculator className="h-4 w-4" />
                  Calculate
                </Button>
                
                <Button
                  onClick={() => {
                    setInputs({})
                    setResult(null)
                    setError(null)
                    setCurrentStep(0)
                  }}
                  outline
                >
                  Clear All
                </Button>
              </div>
              
              {error && (
                <Alert color="rose" className="mt-4">
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5" />
                    <AlertDescription>{error}</AlertDescription>
                  </div>
                </Alert>
              )}
              
              {result && (
                <div className="mt-6 overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 ring-1 ring-green-500/10 dark:from-green-500/10 dark:to-emerald-500/10 dark:ring-green-500/20">
                  <Subheading className="mb-4">Solution</Subheading>
                  
                  <div className="space-y-3">
                    {result.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{step.label}:</span>
                        <span className="text-sm font-medium text-slate-950 dark:text-white">{step.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
                    <Text className="text-sm text-slate-600 dark:text-slate-400 mb-1">Final Answer:</Text>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.result}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg bg-blue-50 p-4 ring-1 ring-blue-500/10 dark:bg-blue-500/10 dark:ring-blue-500/20">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
              How to Use This Calculator
            </h3>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="font-medium">1.</span>
                <span>Fill in each field with your data</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">2.</span>
                <span>Check marks will appear as you complete each step</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">3.</span>
                <span>Click Calculate when all fields are complete</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">4.</span>
                <span>Review the step-by-step solution</span>
              </li>
            </ol>
          </div>
          
          <div className="overflow-hidden rounded-lg bg-amber-50 p-4 ring-1 ring-amber-500/10 dark:bg-amber-500/10 dark:ring-amber-500/20">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
              Related Calculators
            </h3>
            <div className="space-y-2">
              {Object.entries(formulas)
                .filter(([id]) => id !== formulaId)
                .slice(0, 3)
                .map(([id, f]) => (
                  <Link
                    key={id}
                    to={`/formula/${id}`}
                    className="block p-2 rounded hover:bg-white/50 dark:hover:bg-slate-800/50"
                  >
                    <Text className="text-sm font-medium text-slate-950 dark:text-white">
                      {f.name}
                    </Text>
                    <Text className="text-xs text-slate-600 dark:text-slate-400">
                      {f.symbol}
                    </Text>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormulaCalculatorPage