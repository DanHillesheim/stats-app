import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Input } from '../components/catalyst/input'
import { Button } from '../components/catalyst/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/catalyst/table'
import { Search, Star, StarOff, ChevronDown, ChevronRight, Calculator } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

const statisticsSymbols = [
  { symbol: 'μ', name: 'Mu (Population Mean)', description: 'The average value of a population', category: 'Descriptive', formula: '\\mu = \\frac{\\sum x_i}{N}' },
  { symbol: 'σ', name: 'Sigma (Population Std Dev)', description: 'Measures the spread of data in a population', category: 'Descriptive', formula: '\\sigma = \\sqrt{\\frac{\\sum(x_i - \\mu)^2}{N}}' },
  { symbol: 'σ²', name: 'Sigma Squared (Variance)', description: 'The average of squared deviations from the mean', category: 'Descriptive', formula: '\\sigma^2 = \\frac{\\sum(x_i - \\mu)^2}{N}' },
  { symbol: 'x̄', name: 'X-bar (Sample Mean)', description: 'The average value of a sample', category: 'Descriptive', formula: '\\bar{x} = \\frac{\\sum x_i}{n}' },
  { symbol: 's', name: 'Sample Standard Deviation', description: 'Measures the spread of data in a sample', category: 'Descriptive', formula: 's = \\sqrt{\\frac{\\sum(x_i - \\bar{x})^2}{n-1}}' },
  { symbol: 'Σ', name: 'Capital Sigma (Summation)', description: 'Used to sum a series of values', category: 'General', formula: '\\sum_{i=1}^{n} x_i' },
  { symbol: 'n', name: 'Sample Size', description: 'The number of observations in a sample', category: 'General', formula: null },
  { symbol: 'N', name: 'Population Size', description: 'The total number of observations in a population', category: 'General', formula: null },
  { symbol: 'p', name: 'p-value', description: 'Probability of observing results assuming null hypothesis is true', category: 'Inference', formula: 'P(data|H_0)' },
  { symbol: 'α', name: 'Alpha (Significance Level)', description: 'The probability of Type I error (rejecting true H₀)', category: 'Inference', formula: '\\alpha = 0.05 \\text{ (common)}' },
  { symbol: 'β', name: 'Beta (Type II Error)', description: 'The probability of failing to reject false H₀', category: 'Inference', formula: '\\beta = P(\\text{fail to reject } H_0|H_0 \\text{ false})' },
  { symbol: 'H₀', name: 'Null Hypothesis', description: 'The default assumption (no effect)', category: 'Inference', formula: null },
  { symbol: 'H₁', name: 'Alternative Hypothesis', description: 'The research hypothesis (there is an effect)', category: 'Inference', formula: null },
  { symbol: 'r', name: 'Correlation Coefficient', description: 'Measures linear relationship between two variables', category: 'Correlation', formula: 'r = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum(x_i - \\bar{x})^2 \\sum(y_i - \\bar{y})^2}}' },
  { symbol: 'R²', name: 'Coefficient of Determination', description: 'Proportion of variance explained by the model', category: 'Regression', formula: 'R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}' },
  { symbol: 'SE', name: 'Standard Error', description: 'Standard deviation of the sampling distribution', category: 'Inference', formula: 'SE = \\frac{s}{\\sqrt{n}}' },
  { symbol: 'CI', name: 'Confidence Interval', description: 'Range likely containing population parameter', category: 'Inference', formula: '\\bar{x} \\pm z \\cdot \\frac{\\sigma}{\\sqrt{n}}' },
  { symbol: 'z', name: 'z-score', description: 'Number of standard deviations from mean', category: 'Probability', formula: 'z = \\frac{x - \\mu}{\\sigma}' },
  { symbol: 't', name: 't-statistic', description: 'Test statistic for t-test', category: 'Inference', formula: 't = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}' },
  { symbol: 'χ²', name: 'Chi-square', description: 'Test statistic for categorical data', category: 'Inference', formula: '\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}' },
  { symbol: 'df', name: 'Degrees of Freedom', description: 'Number of independent values', category: 'Inference', formula: 'df = n - 1' },
  { symbol: 'P(A)', name: 'Probability of A', description: 'Likelihood of event A occurring', category: 'Probability', formula: 'P(A) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}' },
  { symbol: 'P(A|B)', name: 'Conditional Probability', description: 'Probability of A given B occurred', category: 'Probability', formula: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}' },
  { symbol: 'E(X)', name: 'Expected Value', description: 'The long-run average value', category: 'Probability', formula: 'E(X) = \\sum x_i \\cdot P(x_i)' },
  { symbol: 'Var(X)', name: 'Variance', description: 'Expected value of squared deviations', category: 'Probability', formula: 'Var(X) = E[(X - \\mu)^2]' },
]

const formulas = [
  {
    category: 'Descriptive Statistics',
    items: [
      { name: 'Mean', formula: '\\bar{x} = \\frac{\\sum x_i}{n}', explanation: 'Sum all values and divide by count', example: 'For [2, 4, 6, 8]: mean = (2+4+6+8)/4 = 5', calculatorId: 'mean' },
      { name: 'Median', formula: '\\text{Middle value when sorted}', explanation: 'Sort data and find middle value', example: 'For [2, 4, 6, 8, 10]: median = 6' },
      { name: 'Standard Deviation', formula: 's = \\sqrt{\\frac{\\sum(x_i - \\bar{x})^2}{n-1}}', explanation: 'Square root of variance', example: 'Measures typical distance from mean', calculatorId: 'std-dev' },
      { name: 'Variance', formula: 's^2 = \\frac{\\sum(x_i - \\bar{x})^2}{n-1}', explanation: 'Average squared deviation from mean', example: 'For sample: divide by n-1 (Bessel\'s correction)' },
      { name: 'Range', formula: '\\text{Max} - \\text{Min}', explanation: 'Difference between largest and smallest', example: 'For [2, 4, 6, 8]: range = 8 - 2 = 6' },
    ]
  },
  {
    category: 'Probability Distributions',
    items: [
      { name: 'Normal Distribution', formula: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}', explanation: 'Bell curve distribution', example: '68% within 1σ, 95% within 2σ, 99.7% within 3σ' },
      { name: 'Binomial Distribution', formula: 'P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}', explanation: 'Probability of k successes in n trials', example: 'Coin flips, pass/fail scenarios' },
      { name: 'Poisson Distribution', formula: 'P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}', explanation: 'Events in fixed interval', example: 'Customers per hour, defects per batch' },
    ]
  },
  {
    category: 'Hypothesis Testing',
    items: [
      { name: 'One-sample t-test', formula: 't = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}', explanation: 'Compare sample mean to known value', example: 'Test if average height differs from 170cm', calculatorId: 't-statistic' },
      { name: 'Two-sample t-test', formula: 't = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}', explanation: 'Compare means of two groups', example: 'Compare treatment vs control group' },
      { name: 'Chi-square test', formula: '\\chi^2 = \\sum \\frac{(O - E)^2}{E}', explanation: 'Test independence/goodness of fit', example: 'Test if gender and preference are independent' },
      { name: 'ANOVA F-test', formula: 'F = \\frac{MS_{between}}{MS_{within}}', explanation: 'Compare means of 3+ groups', example: 'Test if teaching methods differ in effectiveness' },
    ]
  },
  {
    category: 'Confidence Intervals',
    items: [
      { name: 'CI for Mean (σ known)', formula: '\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}', explanation: 'Use z-score when σ is known', example: '95% CI: mean ± 1.96 × SE', calculatorId: 'confidence-interval' },
      { name: 'CI for Mean (σ unknown)', formula: '\\bar{x} \\pm t_{\\alpha/2} \\cdot \\frac{s}{\\sqrt{n}}', explanation: 'Use t-score when σ is unknown', example: 'Use t-table with df = n-1' },
      { name: 'CI for Proportion', formula: '\\hat{p} \\pm z \\cdot \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}', explanation: 'Interval for population proportion', example: 'Poll: 60% ± margin of error' },
    ]
  },
  {
    category: 'Regression & Correlation',
    items: [
      { name: 'Linear Regression', formula: 'y = \\beta_0 + \\beta_1 x + \\epsilon', explanation: 'Model linear relationship', example: 'Predict sales from advertising spend' },
      { name: 'Correlation Coefficient', formula: 'r = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}', explanation: 'Measure of linear association', example: 'r = 0.8 indicates strong positive correlation' },
      { name: 'R-squared', formula: 'R^2 = \\frac{SS_{regression}}{SS_{total}}', explanation: 'Proportion of variance explained', example: 'R² = 0.75 means model explains 75% of variance' },
    ]
  }
]

function CheatsheetPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedSections, setExpandedSections] = useState({})
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('stats-favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const toggleFavorite = (symbol) => {
    const newFavorites = favorites.includes(symbol) 
      ? favorites.filter(f => f !== symbol)
      : [...favorites, symbol]
    setFavorites(newFavorites)
    localStorage.setItem('stats-favorites', JSON.stringify(newFavorites))
  }

  const toggleSection = (category) => {
    setExpandedSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const categories = ['All', ...new Set(statisticsSymbols.map(s => s.category))]

  const filteredSymbols = useMemo(() => {
    return statisticsSymbols.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .katex { color: rgb(147, 197, 253) !important; }
        .katex .mord { color: rgb(147, 197, 253) !important; }
        .katex .mbin { color: rgb(147, 197, 253) !important; }
        .katex .mrel { color: rgb(147, 197, 253) !important; }
        .katex .mopen { color: rgb(147, 197, 253) !important; }
        .katex .mclose { color: rgb(147, 197, 253) !important; }
        .katex .mpunct { color: rgb(147, 197, 253) !important; }
        .katex .minner { color: rgb(147, 197, 253) !important; }
        .katex .mord.mathnormal { color: rgb(147, 197, 253) !important; }
      `}} />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Heading className="text-3xl font-bold mb-2 text-white">Statistics Cheatsheet</Heading>
          <Text className="text-gray-300">
            Quick reference for statistical symbols, formulas, and concepts
          </Text>
        </div>

        <div className="overflow-hidden rounded-lg bg-gray-800 shadow ring-1 ring-white/10 mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search symbols, names, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    color={selectedCategory === cat ? 'dark/zinc' : 'dark/white'}
                    outline={selectedCategory !== cat}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader></TableHeader>
                  <TableHeader className="text-gray-300">Symbol</TableHeader>
                  <TableHeader className="text-gray-300">Name</TableHeader>
                  <TableHeader className="text-gray-300">Description</TableHeader>
                  <TableHeader className="text-gray-300">Formula</TableHeader>
                  <TableHeader className="text-gray-300">Category</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSymbols.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <button
                        onClick={() => toggleFavorite(item.symbol)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        {favorites.includes(item.symbol) ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                      </button>
                    </TableCell>
                    <TableCell className="font-bold text-lg text-white">{item.symbol}</TableCell>
                    <TableCell className="font-medium text-gray-200">
                      {item.name}
                      {(item.symbol === 'z' || item.symbol === 't' || item.symbol === 'CI' || item.symbol === 'x̄' || item.symbol === 'σ' || item.symbol === 's') && (
                        <Link to={`/formula/${
                          item.symbol === 'z' ? 'z-score' :
                          item.symbol === 't' ? 't-statistic' :
                          item.symbol === 'CI' ? 'confidence-interval' :
                          item.symbol === 'x̄' ? 'mean' :
                          (item.symbol === 'σ' || item.symbol === 's') ? 'std-dev' : ''
                        }`} className="ml-2 inline-flex">
                          <Calculator className="h-3 w-3 text-green-500 hover:text-green-400" />
                        </Link>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">{item.description}</TableCell>
                    <TableCell>
                      {item.formula && <InlineMath math={item.formula} />}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300">
                        {item.category}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <Subheading className="text-white">Formulas & Explanations</Subheading>
          
          {formulas.map((section, sectionIndex) => (
            <div key={sectionIndex} className="overflow-hidden rounded-lg bg-gray-800 shadow ring-1 ring-white/10">
              <button
                onClick={() => toggleSection(section.category)}
                className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-gray-700/50 sm:px-6"
              >
                <span className="text-base font-semibold text-white">
                  {section.category}
                </span>
                {expandedSections[section.category] ? 
                  <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                }
              </button>
              
              {expandedSections[section.category] && (
                <div className="border-t border-gray-700 px-4 py-4 sm:px-6">
                  <div className="space-y-6">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-blue-500">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-white">
                            {item.name}
                          </h4>
                          {item.calculatorId && (
                            <Link to={`/formula/${item.calculatorId}`}>
                              <Button color="green" className="text-xs">
                                <Calculator className="h-3 w-3" />
                                Try Calculator
                              </Button>
                            </Link>
                          )}
                        </div>
                        <div className="my-3">
                          <BlockMath math={item.formula} />
                        </div>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="inline font-medium text-gray-300">
                              Explanation:
                            </dt>{' '}
                            <dd className="inline text-gray-400">
                              {item.explanation}
                            </dd>
                          </div>
                          <div>
                            <dt className="inline font-medium text-gray-300">
                              Example:
                            </dt>{' '}
                            <dd className="inline text-gray-400">
                              {item.example}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {favorites.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-lg bg-amber-500/10 p-4 ring-1 ring-amber-500/20 sm:p-6">
            <h3 className="text-sm font-semibold text-white">
              Your Favorites ({favorites.length})
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {favorites.map(fav => (
                <span 
                  key={fav} 
                  className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/10"
                >
                  {fav}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CheatsheetPage