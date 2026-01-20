import { useState } from 'react';
import { Delete, Calculator } from 'lucide-react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    if (previousValue && operator && !waitingForNewValue) {
      const result = calculate(parseFloat(previousValue), parseFloat(display), operator);
      setDisplay(String(result));
      setPreviousValue(String(result));
    } else {
      setPreviousValue(display);
    }
    setOperator(op);
    setWaitingForNewValue(true);
  };

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  };

  const handleEqual = () => {
    if (operator && previousValue) {
      const result = calculate(parseFloat(previousValue), parseFloat(display), operator);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (waitingForNewValue) return;
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePercent = () => {
    const num = parseFloat(display);
    setDisplay(String(num / 100));
  };

  const Button = ({ 
    label, 
    onClick, 
    className = "", 
    variant = "default" 
  }: { 
    label: React.ReactNode, 
    onClick: () => void, 
    className?: string,
    variant?: 'default' | 'operator' | 'action' | 'equal'
  }) => {
    const baseStyles = "h-16 text-2xl font-medium rounded-2xl transition-all duration-150 active:scale-95 flex items-center justify-center";
    
    const variants = {
      default: "bg-gray-800 text-white hover:bg-gray-700",
      operator: "bg-orange-500 text-white hover:bg-orange-400",
      action: "bg-gray-300 text-gray-900 hover:bg-gray-200",
      equal: "bg-orange-500 text-white hover:bg-orange-400 col-span-1"
    };

    return (
      <button 
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between text-gray-500 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Calculator size={18} />
            <span className="text-sm font-medium">Calculator</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
        </div>

        {/* Display */}
        <div className="p-6 flex flex-col items-end justify-end h-40">
          <div className="text-gray-400 text-sm h-6 mb-1">
            {previousValue} {operator}
          </div>
          <div className="text-5xl font-light text-white tracking-tight overflow-x-auto w-full text-right scrollbar-hide">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-gray-900">
          <Button label="AC" onClick={handleClear} variant="action" />
          <Button label={<Delete size={24} />} onClick={handleBackspace} variant="action" />
          <Button label="%" onClick={handlePercent} variant="action" />
          <Button label="÷" onClick={() => handleOperator('÷')} variant="operator" />

          <Button label="7" onClick={() => handleNumber('7')} />
          <Button label="8" onClick={() => handleNumber('8')} />
          <Button label="9" onClick={() => handleNumber('9')} />
          <Button label="×" onClick={() => handleOperator('×')} variant="operator" />

          <Button label="4" onClick={() => handleNumber('4')} />
          <Button label="5" onClick={() => handleNumber('5')} />
          <Button label="6" onClick={() => handleNumber('6')} />
          <Button label="-" onClick={() => handleOperator('-')} variant="operator" />

          <Button label="1" onClick={() => handleNumber('1')} />
          <Button label="2" onClick={() => handleNumber('2')} />
          <Button label="3" onClick={() => handleNumber('3')} />
          <Button label="+" onClick={() => handleOperator('+')} variant="operator" />

          <Button label="0" onClick={() => handleNumber('0')} className="col-span-2" />
          <Button label="." onClick={handleDecimal} />
          <Button label="=" onClick={handleEqual} variant="equal" />
        </div>
      </div>
    </div>
  );
}