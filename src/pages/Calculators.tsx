import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ProfileDropdown } from "@/components/ProfileDropdown";

export default function Calculators() {
  const navigate = useNavigate();
  
  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  
  // FD Calculator State
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(6.5);
  const [fdYears, setFdYears] = useState(5);
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);
  
  // Retirement Calculator State
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflation, setInflation] = useState(6);
  
  // SWP Calculator State
  const [swpCorpus, setSwpCorpus] = useState(5000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(40000);
  const [swpRate, setSwpRate] = useState(8);
  const [swpYears, setSwpYears] = useState(20);
  
  // Mutual Fund Calculator State
  const [mfInvestment, setMfInvestment] = useState(100000);
  const [mfRate, setMfRate] = useState(12);
  const [mfYears, setMfYears] = useState(10);
  const [mfType, setMfType] = useState<"lumpsum" | "sip">("lumpsum");
  
  // Validation helper functions
  const validatePositiveNumber = (value: number, min: number = 0) => {
    return !isNaN(value) && value > min;
  };

  const validateAge = (age: number) => {
    return !isNaN(age) && age >= 18 && age <= 100;
  };

  const validateRate = (rate: number) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years > 0 && years <= 50;
  };

  // Input handlers with validation
  const handleSipMonthlyChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validatePositiveNumber(num, 0) && num <= 10000000)) {
      setSipMonthly(num);
    }
  };

  const handleSipRateChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateRate(num)) {
      setSipRate(num);
    }
  };

  const handleSipYearsChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateYears(num)) {
      setSipYears(num);
    }
  };

  const handleFdPrincipalChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validatePositiveNumber(num, 0) && num <= 100000000)) {
      setFdPrincipal(num);
    }
  };

  const handleFdRateChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateRate(num)) {
      setFdRate(num);
    }
  };

  const handleFdYearsChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateYears(num)) {
      setFdYears(num);
    }
  };

  const handleLoanAmountChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validatePositiveNumber(num, 0) && num <= 1000000000)) {
      setLoanAmount(num);
    }
  };

  const handleLoanRateChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateRate(num)) {
      setLoanRate(num);
    }
  };

  const handleLoanYearsChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateYears(num)) {
      setLoanYears(num);
    }
  };

  const handleCurrentAgeChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateAge(num)) {
      setCurrentAge(num);
    }
  };

  const handleRetirementAgeChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validateAge(num) && num > currentAge)) {
      setRetirementAge(num);
    }
  };

  const handleMonthlyExpenseChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validatePositiveNumber(num, 0) && num <= 10000000)) {
      setMonthlyExpense(num);
    }
  };

  const handleInflationChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validateRate(num) && num <= 50)) {
      setInflation(num);
    }
  };

  const handleSwpCorpusChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validatePositiveNumber(num, 0) && num <= 10000000000)) {
      setSwpCorpus(num);
    }
  };

  const handleSwpWithdrawalChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validatePositiveNumber(num, 0) && num <= 10000000)) {
      setSwpWithdrawal(num);
    }
  };

  const handleSwpRateChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateRate(num)) {
      setSwpRate(num);
    }
  };

  const handleSwpYearsChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateYears(num)) {
      setSwpYears(num);
    }
  };

  const handleMfInvestmentChange = (value: string) => {
    const num = Number(value);
    if (value === "" || (validatePositiveNumber(num, 0) && num <= 100000000)) {
      setMfInvestment(num);
    }
  };

  const handleMfRateChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateRate(num)) {
      setMfRate(num);
    }
  };

  const handleMfYearsChange = (value: string) => {
    const num = Number(value);
    if (value === "" || validateYears(num)) {
      setMfYears(num);
    }
  };
  
  // SIP Calculation with yearly breakdown
  const calculateSIP = () => {
    if (!validatePositiveNumber(sipMonthly, 0) || !validateRate(sipRate) || !validateYears(sipYears)) {
      return { futureValue: 0, invested: 0, returns: 0, yearlyData: [] };
    }
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const futureValue = sipMonthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const invested = sipMonthly * months;
    const returns = futureValue - invested;
    
    // Generate yearly data for chart
    const yearlyData = [];
    for (let year = 1; year <= sipYears; year++) {
      const monthsElapsed = year * 12;
      const value = sipMonthly * (((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate));
      const investedAmount = sipMonthly * monthsElapsed;
      yearlyData.push({
        year: `Year ${year}`,
        invested: Math.round(investedAmount),
        value: Math.round(value),
        returns: Math.round(value - investedAmount),
      });
    }
    
    return { futureValue, invested, returns, yearlyData };
  };
  
  // FD Calculation
  const calculateFD = () => {
    if (!validatePositiveNumber(fdPrincipal, 0) || !validateRate(fdRate) || !validateYears(fdYears)) {
      return { maturityAmount: 0, interest: 0 };
    }
    const amount = fdPrincipal * Math.pow(1 + fdRate / 100, fdYears);
    const interest = amount - fdPrincipal;
    return { maturityAmount: amount, interest };
  };
  
  // EMI Calculation
  const calculateEMI = () => {
    if (!validatePositiveNumber(loanAmount, 0) || !validateRate(loanRate) || !validateYears(loanYears)) {
      return { emi: 0, totalAmount: 0, totalInterest: 0 };
    }
    const monthlyRate = loanRate / 12 / 100;
    const months = loanYears * 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - loanAmount;
    return { emi, totalAmount, totalInterest };
  };
  
  // Retirement Calculation with detailed breakdown
  const calculateRetirement = () => {
    if (!validateAge(currentAge) || !validateAge(retirementAge) || retirementAge <= currentAge || 
        !validatePositiveNumber(monthlyExpense, 0) || !validateRate(inflation)) {
      return { corpusNeeded: 0, futureExpense: 0, sipNeeded: 0, ageData: [] };
    }
    const yearsToRetirement = retirementAge - currentAge;
    const futureExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);
    const yearsInRetirement = 25;
    const corpusNeeded = futureExpense * 12 * yearsInRetirement;
    
    // Calculate monthly SIP needed
    const monthlyRate = 12 / 12 / 100; // Assuming 12% return
    const months = yearsToRetirement * 12;
    const sipNeeded = corpusNeeded / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    
    // Generate age-wise data
    const ageData = [];
    for (let age = currentAge; age <= retirementAge; age += 5) {
      const yearsFromNow = age - currentAge;
      const expenseAtAge = monthlyExpense * Math.pow(1 + inflation / 100, yearsFromNow);
      ageData.push({
        age: `Age ${age}`,
        monthlyExpense: Math.round(expenseAtAge),
      });
    }
    
    return { corpusNeeded, futureExpense, sipNeeded, ageData };
  };
  
  // SWP Calculation
  const calculateSWP = () => {
    if (!validatePositiveNumber(swpCorpus, 0) || !validatePositiveNumber(swpWithdrawal, 0) || 
        !validateRate(swpRate) || !validateYears(swpYears)) {
      return { finalBalance: 0, totalWithdrawn: 0, yearlyData: [] };
    }
    const monthlyRate = swpRate / 12 / 100;
    let balance = swpCorpus;
    let totalWithdrawn = 0;
    
    const yearlyData = [];
    for (let year = 1; year <= swpYears; year++) {
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) - swpWithdrawal;
        totalWithdrawn += swpWithdrawal;
        if (balance <= 0) {
          balance = 0;
          break;
        }
      }
      yearlyData.push({
        year: `Year ${year}`,
        balance: Math.round(balance),
        withdrawn: Math.round(totalWithdrawn),
      });
      if (balance <= 0) break;
    }
    
    return { finalBalance: balance, totalWithdrawn, yearlyData };
  };
  
  // Mutual Fund Calculation
  const calculateMutualFund = () => {
    if (!validatePositiveNumber(mfInvestment, 0) || !validateRate(mfRate) || !validateYears(mfYears)) {
      return { futureValue: 0, invested: 0, returns: 0, yearlyData: [] };
    }
    if (mfType === "lumpsum") {
      const futureValue = mfInvestment * Math.pow(1 + mfRate / 100, mfYears);
      const returns = futureValue - mfInvestment;
      
      const yearlyData = [];
      for (let year = 1; year <= mfYears; year++) {
        const value = mfInvestment * Math.pow(1 + mfRate / 100, year);
        yearlyData.push({
          year: `Year ${year}`,
          value: Math.round(value),
          invested: mfInvestment,
        });
      }
      
      return { futureValue, invested: mfInvestment, returns, yearlyData };
    } else {
      // SIP mode
      const monthlyRate = mfRate / 12 / 100;
      const months = mfYears * 12;
      const futureValue = mfInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      const invested = mfInvestment * months;
      const returns = futureValue - invested;
      
      const yearlyData = [];
      for (let year = 1; year <= mfYears; year++) {
        const monthsElapsed = year * 12;
        const value = mfInvestment * (((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate));
        const investedAmount = mfInvestment * monthsElapsed;
        yearlyData.push({
          year: `Year ${year}`,
          value: Math.round(value),
          invested: Math.round(investedAmount),
        });
      }
      
      return { futureValue, invested, returns, yearlyData };
    }
  };
  
  const sipResult = calculateSIP();
  const fdResult = calculateFD();
  const emiResult = calculateEMI();
  const retirementResult = calculateRetirement();
  const swpResult = calculateSWP();
  const mfResult = calculateMutualFund();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold">Financial Calculators</h1>
          <ProfileDropdown />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Calculator className="text-blue-500" />
            Plan Your Financial Future
          </h2>
          <p className="text-muted-foreground">
            Use these calculators to make informed financial decisions
          </p>
        </motion.div>

        <Tabs defaultValue="sip" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="sip">SIP</TabsTrigger>
            <TabsTrigger value="fd">FD</TabsTrigger>
            <TabsTrigger value="emi">EMI</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="swp">SWP</TabsTrigger>
            <TabsTrigger value="mutualfund">Mutual Fund</TabsTrigger>
          </TabsList>

          {/* SIP Calculator */}
          <TabsContent value="sip">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle>SIP Calculator</CardTitle>
                <CardDescription>Calculate returns on your Systematic Investment Plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Monthly Investment (₹)</Label>
                      <Input
                        type="number"
                        value={sipMonthly || ""}
                        onChange={(e) => handleSipMonthlyChange(e.target.value)}
                        min="1"
                        max="10000000"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹1,00,00,000</p>
                    </div>
                    <div>
                      <Label>Expected Return Rate (% p.a.)</Label>
                      <Input
                        type="number"
                        value={sipRate || ""}
                        onChange={(e) => handleSipRateChange(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Enter rate"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 0% - 100%</p>
                    </div>
                    <div>
                      <Label>Time Period (Years)</Label>
                      <Input
                        type="number"
                        value={sipYears || ""}
                        onChange={(e) => handleSipYearsChange(e.target.value)}
                        min="1"
                        max="50"
                        placeholder="Enter years"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Investment</p>
                      <p className="text-2xl font-bold">{formatCurrency(sipResult.invested)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Returns</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(sipResult.returns)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Future Value</p>
                      <p className="text-3xl font-bold text-blue-600">{formatCurrency(sipResult.futureValue)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Chart */}
                {sipResult.yearlyData.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Growth Projection</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={sipResult.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="invested" stroke="#8884d8" name="Invested Amount" />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Future Value" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FD Calculator */}
          <TabsContent value="fd">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle>Fixed Deposit Calculator</CardTitle>
                <CardDescription>Calculate maturity amount for your fixed deposit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Principal Amount (₹)</Label>
                      <Input
                        type="number"
                        value={fdPrincipal || ""}
                        onChange={(e) => handleFdPrincipalChange(e.target.value)}
                        min="1"
                        max="100000000"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹10,00,00,000</p>
                    </div>
                    <div>
                      <Label>Interest Rate (% p.a.)</Label>
                      <Input
                        type="number"
                        value={fdRate || ""}
                        onChange={(e) => handleFdRateChange(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Enter rate"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 0% - 100%</p>
                    </div>
                    <div>
                      <Label>Time Period (Years)</Label>
                      <Input
                        type="number"
                        value={fdYears || ""}
                        onChange={(e) => handleFdYearsChange(e.target.value)}
                        min="1"
                        max="50"
                        placeholder="Enter years"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Principal Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(fdPrincipal)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Earned</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(fdResult.interest)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Maturity Amount</p>
                      <p className="text-3xl font-bold text-purple-600">{formatCurrency(fdResult.maturityAmount)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EMI Calculator */}
          <TabsContent value="emi">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle>EMI Calculator</CardTitle>
                <CardDescription>Calculate your loan EMI and total interest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Loan Amount (₹)</Label>
                      <Input
                        type="number"
                        value={loanAmount || ""}
                        onChange={(e) => handleLoanAmountChange(e.target.value)}
                        min="1"
                        max="1000000000"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹100,00,00,000</p>
                    </div>
                    <div>
                      <Label>Interest Rate (% p.a.)</Label>
                      <Input
                        type="number"
                        value={loanRate || ""}
                        onChange={(e) => handleLoanRateChange(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Enter rate"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 0% - 100%</p>
                    </div>
                    <div>
                      <Label>Loan Tenure (Years)</Label>
                      <Input
                        type="number"
                        value={loanYears || ""}
                        onChange={(e) => handleLoanYearsChange(e.target.value)}
                        min="1"
                        max="50"
                        placeholder="Enter years"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly EMI</p>
                      <p className="text-3xl font-bold text-orange-600">{formatCurrency(emiResult.emi)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Interest</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(emiResult.totalInterest)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(emiResult.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retirement Calculator */}
          <TabsContent value="retirement">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle>Retirement Calculator</CardTitle>
                <CardDescription>Plan your retirement corpus based on age and expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Current Age</Label>
                      <Input
                        type="number"
                        value={currentAge || ""}
                        onChange={(e) => handleCurrentAgeChange(e.target.value)}
                        min="18"
                        max="100"
                        placeholder="Enter age"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 18 - 100 years</p>
                    </div>
                    <div>
                      <Label>Retirement Age</Label>
                      <Input
                        type="number"
                        value={retirementAge || ""}
                        onChange={(e) => handleRetirementAgeChange(e.target.value)}
                        min={currentAge + 1}
                        max="100"
                        placeholder="Enter age"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Must be greater than current age</p>
                    </div>
                    <div>
                      <Label>Current Monthly Expense (₹)</Label>
                      <Input
                        type="number"
                        value={monthlyExpense || ""}
                        onChange={(e) => handleMonthlyExpenseChange(e.target.value)}
                        min="1"
                        max="10000000"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹1,00,00,000</p>
                    </div>
                    <div>
                      <Label>Expected Inflation (%)</Label>
                      <Input
                        type="number"
                        value={inflation || ""}
                        onChange={(e) => handleInflationChange(e.target.value)}
                        min="0"
                        max="50"
                        step="0.1"
                        placeholder="Enter rate"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 0% - 50%</p>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Years to Retirement</p>
                      <p className="text-2xl font-bold">{retirementAge - currentAge} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Future Monthly Expense</p>
                      <p className="text-2xl font-bold">{formatCurrency(retirementResult.futureExpense)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Retirement Corpus Needed</p>
                      <p className="text-3xl font-bold text-indigo-600">{formatCurrency(retirementResult.corpusNeeded)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly SIP Required</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(retirementResult.sipNeeded)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Age-wise expense chart */}
                {retirementResult.ageData.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Expense Projection by Age</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={retirementResult.ageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="monthlyExpense" fill="#8884d8" name="Monthly Expense" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SWP Calculator */}
          <TabsContent value="swp">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle>SWP Calculator</CardTitle>
                <CardDescription>Systematic Withdrawal Plan - Plan your retirement withdrawals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Total Corpus (₹)</Label>
                      <Input
                        type="number"
                        value={swpCorpus || ""}
                        onChange={(e) => handleSwpCorpusChange(e.target.value)}
                        min="1"
                        max="10000000000"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹1,000,00,00,000</p>
                    </div>
                    <div>
                      <Label>Monthly Withdrawal (₹)</Label>
                      <Input
                        type="number"
                        value={swpWithdrawal || ""}
                        onChange={(e) => handleSwpWithdrawalChange(e.target.value)}
                        min="1"
                        max="10000000"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹1,00,00,000</p>
                    </div>
                    <div>
                      <Label>Expected Return Rate (% p.a.)</Label>
                      <Input
                        type="number"
                        value={swpRate || ""}
                        onChange={(e) => handleSwpRateChange(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Enter rate"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 0% - 100%</p>
                    </div>
                    <div>
                      <Label>Withdrawal Period (Years)</Label>
                      <Input
                        type="number"
                        value={swpYears || ""}
                        onChange={(e) => handleSwpYearsChange(e.target.value)}
                        min="1"
                        max="50"
                        placeholder="Enter years"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Initial Corpus</p>
                      <p className="text-2xl font-bold">{formatCurrency(swpCorpus)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(swpResult.totalWithdrawn)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Final Balance</p>
                      <p className="text-3xl font-bold text-teal-600">{formatCurrency(swpResult.finalBalance)}</p>
                    </div>
                  </div>
                </div>
                
                {/* SWP Chart */}
                {swpResult.yearlyData.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Balance Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={swpResult.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="balance" stroke="#14b8a6" name="Remaining Balance" />
                        <Line type="monotone" dataKey="withdrawn" stroke="#f97316" name="Total Withdrawn" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mutual Fund Calculator */}
          <TabsContent value="mutualfund">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle>Mutual Fund Calculator</CardTitle>
                <CardDescription>Calculate returns for lumpsum or SIP investments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Investment Type</Label>
                      <div className="flex gap-4 mt-2">
                        <Button
                          variant={mfType === "lumpsum" ? "default" : "outline"}
                          onClick={() => setMfType("lumpsum")}
                          className="flex-1"
                        >
                          Lumpsum
                        </Button>
                        <Button
                          variant={mfType === "sip" ? "default" : "outline"}
                          onClick={() => setMfType("sip")}
                          className="flex-1"
                        >
                          SIP
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>{mfType === "lumpsum" ? "Investment Amount (₹)" : "Monthly Investment (₹)"}</Label>
                      <Input
                        type="number"
                        value={mfInvestment || ""}
                        onChange={(e) => handleMfInvestmentChange(e.target.value)}
                        min="1"
                        max="100000000"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹10,00,00,000</p>
                    </div>
                    <div>
                      <Label>Expected Return Rate (% p.a.)</Label>
                      <Input
                        type="number"
                        value={mfRate || ""}
                        onChange={(e) => handleMfRateChange(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Enter rate"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 0% - 100%</p>
                    </div>
                    <div>
                      <Label>Investment Period (Years)</Label>
                      <Input
                        type="number"
                        value={mfYears || ""}
                        onChange={(e) => handleMfYearsChange(e.target.value)}
                        min="1"
                        max="50"
                        placeholder="Enter years"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Investment</p>
                      <p className="text-2xl font-bold">{formatCurrency(mfResult.invested)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Returns</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(mfResult.returns)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Future Value</p>
                      <p className="text-3xl font-bold text-violet-600">{formatCurrency(mfResult.futureValue)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Mutual Fund Chart */}
                {mfResult.yearlyData.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Investment Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mfResult.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="invested" stroke="#8b5cf6" name="Invested Amount" />
                        <Line type="monotone" dataKey="value" stroke="#d946ef" name="Future Value" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}