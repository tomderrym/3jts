/**
 * CATEGORIES Component
 * Props: { amount?: any, activity?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { Plus, Trash2, Edit2, Wallet, DollarSign, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: number;
}

export default function CATEGORIES = [
  'Food', 'Transport', 'Utilities', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Education', 'Savings', 'Other'
];

interface ExpensesProps {
  accessToken: string;
  onXPEarned?: (amount: number, activity: string) => void;
}

export const Expenses: React.FC<ExpensesProps> = ({ accessToken, onXPEarned }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form state
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Load expenses from local storage on component mount
    const storedExpenses = localStorage.getItem('movethemind_expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  const saveExpensesToLocalStorage = (currentExpenses: Expense[]) => {
    localStorage.setItem('movethemind_expenses', JSON.stringify(currentExpenses));
  };

  const resetForm = () => {
    setCategory(CATEGORIES[0]);
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setEditingExpense(null);
  };

  const handleAddOrUpdateExpense = () => {
    const parsedAmount = parseFloat(amount);
    if (!category || isNaN(parsedAmount) || parsedAmount <= 0 || !date) {
      toast.error('Please fill in all required fields with valid values.');
      return;
    }

    const newExpense: Expense = {
      id: editingExpense ? editingExpense.id : Date.now().toString(),
      category,
      amount: parsedAmount,
      date,
      notes: notes.trim() || undefined,
      createdAt: editingExpense ? editingExpense.createdAt : Date.now(),
    };

    let updatedExpenses;
    if (editingExpense) {
      updatedExpenses = expenses.map(exp => (exp.id === newExpense.id ? newExpense : exp));
      toast.success('Expense updated!');
    } else {
      updatedExpenses = [newExpense, ...expenses];
      onXPEarned?.(5, 'Log Expense');
      toast.success('Expense added!');
    }

    setExpenses(updatedExpenses);
    saveExpensesToLocalStorage(updatedExpenses);
    setShowCreateDialog(false);
    resetForm();
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    saveExpensesToLocalStorage(updatedExpenses);
    toast.success('Expense deleted!');
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setCategory(expense.category);
    setAmount(expense.amount.toString());
    setDate(expense.date);
    setNotes(expense.notes || '');
    setShowCreateDialog(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6 pb-24 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1">
        <div className="pt-6 mb-6">
          <h2 className="text-2xl mb-2 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" /> Expenses
          </h2>
          <p className="text-muted-foreground">Track your spending and financial health.</p>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Spent:</span>
            <span className="text-destructive">-${totalExpenses.toFixed(2)}</span>
          </div>
        </Card>

        <Button onClick={openCreateDialog} className="w-full mb-6 py-3">
          <Plus className="w-5 h-5 mr-2" /> Add New Expense
        </Button>

        <h3 className="text-xl font-semibold mb-4">Your Expenses</h3>

        <div className="space-y-4">
          {expenses.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No expenses recorded yet. Start by adding one!
            </Card>
          ) : (
            expenses.sort((a,b) => b.createdAt - a.createdAt).map(expense => (
              <Card key={expense.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" /> {expense.category}
                  </p>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                    <CalendarDays className="w-3 h-3" /> {expense.date}
                  </p>
                  {expense.notes && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{expense.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-destructive text-lg font-bold">-${expense.amount.toFixed(2)}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(expense)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="p-6">
            <DialogHeader className="text-center">
              <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              <DialogDescription>Fill in the details for your {editingExpense ? 'expense' : 'new expense'}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="mb-1 block">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full h-[50px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1 block">Amount</Label>
                <Input
                  type="number"
                  placeholder="e.g., 25.50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  className="h-[50px]"
                />
              </div>
              <div>
                <Label className="mb-1 block">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-[50px]"
                />
              </div>
              <div>
                <Label className="mb-1 block">Notes (Optional)</Label>
                <Textarea
                  placeholder="e.g., Dinner with friends"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAddOrUpdateExpense} className="w-full">
              {editingExpense ? 'Save Changes' : 'Add Expense'}
            </Button>
            <DialogClose asChild>
                <Button variant="outline" className="w-full mt-2">Cancel</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
