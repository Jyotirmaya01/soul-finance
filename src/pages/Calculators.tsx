import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

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
  
  // SIP Calculation
  const calculateSIP = () => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const futureValue = sipMonthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const invested = sipMonthly * months;
    const returns = futureValue - invested;
    return { futureValue, invested, returns };
  };
  
  // FD Calculation
  const calculateFD = () => {
    const amount = fdPrincipal * Math.pow(1 + fdRate / 100, fdYears);
    const interest = amount - fdPrincipal;
    return { maturityAmount: amount, interest };
  };
  
  // EMI Calculation
  const calculateEMI = () => {
    const monthlyRate = loanRate / 12 / 100;
    const months = loanYears * 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - loanAmount;
    return { emi, totalAmount, totalInterest };
  };
  
  // Retirement Calculation
  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const futureExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);
    const yearsInRetirement = 25; // Assuming 25 years post-retirement
    const corpusNeeded = futureExpense * 12 * yearsInRetirement;
    return { corpusNeeded, futureExpense };
  };
  
  const sipResult = calculateSIP();
  const fdResult = calculateFD();
  const emiResult = calculateEMI();
  const retirementResult = calculateRetirement();
  
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
          <div className="w-24" />
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="sip">SIP</TabsTrigger>
            <TabsTrigger value="fd">Fixed Deposit</TabsTrigger>
            <TabsTrigger value="emi">EMI</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
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
                        value={sipMonthly}
                        onChange={(e) => setSipMonthly(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Expected Return Rate (% p.a.)</Label>
                      <Input
                        type="number"
                        value={sipRate}
                        onChange={(e) => setSipRate(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Time Period (Years)</Label>
                      <Input
                        type="number"
                        value={sipYears}
                        onChange={(e) => setSipYears(Number(e.target.value))}
                      />
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
                        value={fdPrincipal}
                        onChange={(e) => setFdPrincipal(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Interest Rate (% p.a.)</Label>
                      <Input
                        type="number"
                        value={fdRate}
                        onChange={(e) => setFdRate(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Time Period (Years)</Label>
                      <Input
                        type="number"
                        value={fdYears}
                        onChange={(e) => setFdYears(Number(e.target.value))}
                      />
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
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Interest Rate (% p.a.)</Label>
                      <Input
                        type="number"
                        value={loanRate}
                        onChange={(e) => setLoanRate(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Loan Tenure (Years)</Label>
                      <Input
                        type="number"
                        value={loanYears}
                        onChange={(e) => setLoanYears(Number(e.target.value))}
                      />
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
                <CardDescription>Plan your retirement corpus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Current Age</Label>
                      <Input
                        type="number"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Retirement Age</Label>
                      <Input
                        type="number"
                        value={retirementAge}
                        onChange={(e) => setRetirementAge(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Current Monthly Expense (₹)</Label>
                      <Input
                        type="number"
                        value={monthlyExpense}
                        onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Expected Inflation (%)</Label>
                      <Input
                        type="number"
                        value={inflation}
                        onChange={(e) => setInflation(Number(e.target.value))}
                      />
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
