import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddCustomInvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: {
    investmentName: string;
    category?: string;
    amountInvested: number;
    currentValue: number;
    purchaseDate: string;
    quantity?: number;
    notes?: string;
  }) => Promise<void>;
}

export function AddCustomInvestmentDialog({ open, onOpenChange, onAdd }: AddCustomInvestmentDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().substring(0, 10));
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || name.trim() === "") {
      toast.error("Please enter an investment name");
      return;
    }

    if (!amount || amount.trim() === "") {
      toast.error("Please enter the amount invested");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    if (!currentValue || currentValue.trim() === "") {
      toast.error("Please enter the current value");
      return;
    }

    const currentValueNum = parseFloat(currentValue);
    if (isNaN(currentValueNum) || currentValueNum < 0) {
      toast.error("Please enter a valid current value");
      return;
    }

    if (quantity && quantity.trim() !== "") {
      const quantityNum = parseFloat(quantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        toast.error("Please enter a valid positive quantity");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        investmentName: name.trim(),
        category: category && category.trim() !== "" ? category.trim() : undefined,
        amountInvested: amountNum,
        currentValue: currentValueNum,
        purchaseDate,
        quantity: quantity && quantity.trim() !== "" ? parseFloat(quantity) : undefined,
        notes: notes && notes.trim() !== "" ? notes.trim() : undefined,
      });
      toast.success("Custom investment added to portfolio! 💚");
      setName("");
      setCategory("");
      setAmount("");
      setCurrentValue("");
      setPurchaseDate(new Date().toISOString().substring(0, 10));
      setQuantity("");
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add custom investment:", error);
      toast.error("Failed to add custom investment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Custom Investment</DialogTitle>
          <DialogDescription>
            Track investments from other platforms (all amounts in USD)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Investment Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Apple Stock, Bitcoin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              placeholder="e.g., Stocks, Crypto"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Invested (USD) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="$0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value (USD) *</Label>
              <Input
                id="currentValue"
                type="number"
                placeholder="$0.00"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Number of units"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Investment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
