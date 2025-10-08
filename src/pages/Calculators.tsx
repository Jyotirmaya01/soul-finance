import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { LumpsumCalculator } from "@/components/calculators/LumpsumCalculator";
import { PPFCalculator } from "@/components/calculators/PPFCalculator";
import { GratuityCalculator } from "@/components/calculators/GratuityCalculator";
import { CalculatorCard } from "@/components/calculators/CalculatorCard";
import { SIPCalculator } from "@/components/calculators/SIPCalculator";
import { FDCalculator } from "@/components/calculators/FDCalculator";
import { EMICalculator } from "@/components/calculators/EMICalculator";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { SWPCalculator } from "@/components/calculators/SWPCalculator";
import { MutualFundCalculator } from "@/components/calculators/MutualFundCalculator";

export default function Calculators() {
  const navigate = useNavigate();

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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-1">
            <TabsTrigger value="sip">SIP</TabsTrigger>
            <TabsTrigger value="lumpsum">Lumpsum</TabsTrigger>
            <TabsTrigger value="fd">FD</TabsTrigger>
            <TabsTrigger value="ppf">PPF</TabsTrigger>
            <TabsTrigger value="emi">EMI</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="swp">SWP</TabsTrigger>
            <TabsTrigger value="mutualfund">Mutual Fund</TabsTrigger>
            <TabsTrigger value="gratuity">Gratuity</TabsTrigger>
          </TabsList>

          <TabsContent value="sip">
            <CalculatorCard
              title="SIP Calculator"
              description="Calculate returns on your Systematic Investment Plan"
            >
              <SIPCalculator />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="lumpsum">
            <CalculatorCard
              title="Lumpsum Calculator"
              description="Calculate returns on your one-time investment"
            >
              <LumpsumCalculator />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="fd">
            <CalculatorCard
              title="Fixed Deposit Calculator"
              description="Calculate maturity amount for your fixed deposit"
            >
              <FDCalculator />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="ppf">
            <CalculatorCard
              title="PPF Calculator"
              description="Calculate returns on Public Provident Fund with 15-year lock-in"
            >
              <PPFCalculator />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="emi">
            <CalculatorCard
              title="EMI Calculator"
              description="Calculate your loan EMI and total interest"
            >
              <EMICalculator />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="retirement">
            <CalculatorCard
              title="Retirement Calculator"
              description="Plan your retirement corpus based on age and expenses"
            >
              <RetirementCalculator />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="swp">
            <CalculatorCard
              title="SWP Calculator"
              description="Systematic Withdrawal Plan - Plan your retirement withdrawals"
            >
              <SWPCalculator />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="mutualfund">
            <CalculatorCard
              title="Mutual Fund Calculator"
              description="Calculate returns for lumpsum or SIP investments"
            >
              <MutualFundCalculator />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="gratuity">
            <CalculatorCard
              title="Gratuity Calculator"
              description="Calculate gratuity amount based on salary and years of service"
            >
              <GratuityCalculator />
            </CalculatorCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}