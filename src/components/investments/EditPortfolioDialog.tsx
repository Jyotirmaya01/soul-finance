import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface EditPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: any;
  onUpdate: (data: { portfolioId: Id<"userPortfolio">; currentValue: number; quantity?: number; notes?: string }) => Promise<void>;
}

export function EditPortfolioDialog({ open, onOpenChange, entry, onUpdate }: EditPortfolioDialogProps) {
  const [currentValue, setCurrentValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (entry) {
      setCurrentValue(entry.currentValue.toString());
      setQuantity(entry.quantity ? entry.quantity.toString() : "");
      setNotes(entry.notes || "");
    }
  }, [entry]);

  const handleSubmit = async () => {
    if (!entry) {
      toast.error("No entry selected");
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
      await onUpdate({
        portfolioId: entry._id,
        currentValue: currentValueNum,
        quantity: quantity && quantity.trim() !== "" ? parseFloat(quantity) : undefined,
        notes: notes && notes.trim() !== "" ? notes.trim() : undefined,
      });
      toast.success("Investment updated successfully! 💚");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update investment:", error);
      toast.error("Failed to update investment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Investment</DialogTitle>
          <DialogDescription>
            Update {entry?.investmentName} (amounts in USD)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            {isSubmitting ? "Updating..." : "Update Investment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
