import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function GratuityCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(50000);
  const [yearsOfService, setYearsOfService] = useState(10);

  const validateSalary = (value: number) => {
    return !isNaN(value) && value > 0 && value <= 10000000;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years >= 0 && years <= 50;
  };

  const calculateGratuity = () => {
    if (!validateSalary(monthlySalary) || !validateYears(yearsOfService)) {
      return { gratuityAmount: 0, isEligible: false };
    }

    const isEligible = yearsOfService >= 5;
    
    if (!isEligible) {
      return { gratuityAmount: 0, isEligible: false };
    }

    // Formula: (Last drawn salary × 15 × years of service) / 26
    const gratuityAmount = (monthlySalary * 15 * yearsOfService) / 26;

    return { gratuityAmount, isEligible };
  };

  const result = calculateGratuity();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Gratuity is payable after completing 5 years of continuous service. Formula: (Last drawn salary × 15 × years of service) / 26
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Monthly Salary (₹)</Label>
            <Input
              type="number"
              value={monthlySalary || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateSalary(num)) {
                  setMonthlySalary(num);
                }
              }}
              min="1"
              max="10000000"
              placeholder="Enter monthly salary"
            />
            <p className="text-xs text-muted-foreground mt-1">Last drawn basic salary + DA</p>
          </div>
          <div>
            <Label>Years of Service</Label>
            <Input
              type="number"
              value={yearsOfService || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYears(num)) {
                  setYearsOfService(num);
                }
              }}
              min="0"
              max="50"
              step="0.5"
              placeholder="Enter years"
            />
            <p className="text-xs text-muted-foreground mt-1">Minimum 5 years required for eligibility</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Salary</p>
            <p className="text-2xl font-bold">{formatCurrency(monthlySalary)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Years of Service</p>
            <p className="text-2xl font-bold">{yearsOfService} years</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Eligibility Status</p>
            <p className={`text-xl font-bold ${result.isEligible ? 'text-green-600' : 'text-red-600'}`}>
              {result.isEligible ? 'Eligible' : 'Not Eligible (Need 5+ years)'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gratuity Amount</p>
            <p className="text-3xl font-bold text-rose-600">{formatCurrency(result.gratuityAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
