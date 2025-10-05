import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface AddToPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment: any;
  onAdd: (data: { investmentId: Id<"investments">; investmentName: string; amountInvested: number; quantity?: number; notes?: string }) => Promise<void>;
}

export function AddToPortfolioDialog({ open, onOpenChange, investment, onAdd }: AddToPortfolioDialogProps) {
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!investment) {
      toast.error("No investment selected");
      return;
    }

    if (!amount || amount.trim() === "") {
      toast.error("Please enter an amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    if (amountNum < investment.minInvestment) {
      toast.error(`Minimum investment is $${investment.minInvestment.toLocaleString()}`);
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
        investmentId: investment._id,
        investmentName: investment.name,
        amountInvested: amountNum,
        quantity: quantity && quantity.trim() !== "" ? parseFloat(quantity) : undefined,
        notes: notes && notes.trim() !== "" ? notes.trim() : undefined,
      });
      toast.success("Investment added to portfolio! 💚");
      setAmount("");
      setQuantity("");
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add investment:", error);
      toast.error("Failed to add investment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Portfolio</DialogTitle>
          <DialogDescription>
            Add {investment?.name || "this investment"} to your portfolio
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount (USD) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Min. $${investment ? investment.minInvestment.toLocaleString() : 0}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={investment ? investment.minInvestment : 0}
              step="0.01"
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
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this investment..."
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
            {isSubmitting ? "Adding..." : "Add to Portfolio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
