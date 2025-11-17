import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Plus, Trash2, Calculator, PieChart, BarChart3 } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  weight: number;
  value: number;
  ratio: number;
}

interface OptimizedItem extends Item {
  selectedWeight: number;
  selectedValue: number;
  fraction: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'shopping' | 'portfolio'>('shopping');
  
  // Shopping Optimizer State
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState<number>(50);
  const [itemName, setItemName] = useState('');
  const [itemWeight, setItemWeight] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [isFractional, setIsFractional] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<{
    items: OptimizedItem[];
    totalWeight: number;
    totalValue: number;
  } | null>(null);

  // Portfolio Optimizer State
  const [stocks, setStocks] = useState<Item[]>([]);
  const [budget, setBudget] = useState<number>(10000);
  const [stockName, setStockName] = useState('');
  const [stockCost, setStockCost] = useState('');
  const [stockReturn, setStockReturn] = useState('');
  const [portfolioResult, setPortfolioResult] = useState<{
    items: OptimizedItem[];
    totalCost: number;
    totalReturn: number;
  } | null>(null);

  const addItem = () => {
    if (itemName && itemWeight && itemValue) {
      const weight = parseFloat(itemWeight);
      const value = parseFloat(itemValue);
      const newItem: Item = {
        id: Date.now().toString(),
        name: itemName,
        weight,
        value,
        ratio: value / weight
      };
      setItems([...items, newItem]);
      setItemName('');
      setItemWeight('');
      setItemValue('');
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const optimizeKnapsack = () => {
    const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
    const optimized: OptimizedItem[] = [];
    let remainingCapacity = capacity;
    let totalWeight = 0;
    let totalValue = 0;

    for (const item of sortedItems) {
      if (remainingCapacity <= 0) break;

      if (isFractional) {
        const canTake = Math.min(item.weight, remainingCapacity);
        const fraction = canTake / item.weight;
        optimized.push({
          ...item,
          selectedWeight: canTake,
          selectedValue: item.value * fraction,
          fraction
        });
        remainingCapacity -= canTake;
        totalWeight += canTake;
        totalValue += item.value * fraction;
      } else {
        if (item.weight <= remainingCapacity) {
          optimized.push({
            ...item,
            selectedWeight: item.weight,
            selectedValue: item.value,
            fraction: 1
          });
          remainingCapacity -= item.weight;
          totalWeight += item.weight;
          totalValue += item.value;
        }
      }
    }

    setOptimizedResult({ items: optimized, totalWeight, totalValue });
  };

  const addStock = () => {
    if (stockName && stockCost && stockReturn) {
      const cost = parseFloat(stockCost);
      const returnValue = parseFloat(stockReturn);
      const newStock: Item = {
        id: Date.now().toString(),
        name: stockName,
        weight: cost,
        value: returnValue,
        ratio: returnValue / cost
      };
      setStocks([...stocks, newStock]);
      setStockName('');
      setStockCost('');
      setStockReturn('');
    }
  };

  const removeStock = (id: string) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const optimizePortfolio = () => {
    const sortedStocks = [...stocks].sort((a, b) => b.ratio - a.ratio);
    const optimized: OptimizedItem[] = [];
    let remainingBudget = budget;
    let totalCost = 0;
    let totalReturn = 0;

    for (const stock of sortedStocks) {
      if (remainingBudget <= 0) break;

      const canBuy = Math.min(stock.weight, remainingBudget);
      const fraction = canBuy / stock.weight;
      optimized.push({
        ...stock,
        selectedWeight: canBuy,
        selectedValue: stock.value * fraction,
        fraction
      });
      remainingBudget -= canBuy;
      totalCost += canBuy;
      totalReturn += stock.value * fraction;
    }

    setPortfolioResult({ items: optimized, totalCost, totalReturn });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Knapsack Optimizer</h1>
          <p className="text-gray-600">Smart Shopping & Investment Optimization</p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab('shopping')}
              className={`px-6 py-2 rounded-md flex items-center gap-2 transition-colors ${
                activeTab === 'shopping'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <ShoppingCart size={20} />
              Shopping
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-2 rounded-md flex items-center gap-2 transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <TrendingUp size={20} />
              Portfolio
            </button>
          </div>
        </div>

        {activeTab === 'shopping' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <ShoppingCart className="text-blue-500" />
                  Shopping Optimizer
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bag Capacity (kg)
                    </label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="fractional"
                      checked={isFractional}
                      onChange={(e) => setIsFractional(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="fractional" className="text-sm font-medium text-gray-700">
                      Allow fractional items
                    </label>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-700 mb-3">Add Item</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Weight (kg)"
                          value={itemWeight}
                          onChange={(e) => setItemWeight(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Value ($)"
                          value={itemValue}
                          onChange={(e) => setItemValue(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={addItem}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add Item
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={optimizeKnapsack}
                    disabled={items.length === 0}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Calculator size={20} />
                    Optimize Selection
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Items List</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No items added yet</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.weight}kg, ${item.value} (Ratio: {item.ratio.toFixed(2)})
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {optimizedResult && (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <PieChart className="text-green-500" />
                      Optimization Results
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Total Weight:</span>
                        <span className="font-bold text-blue-600">{optimizedResult.totalWeight.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Total Value:</span>
                        <span className="font-bold text-green-600">${optimizedResult.totalValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">Capacity Used:</span>
                        <span className="font-bold text-purple-600">
                          {((optimizedResult.totalWeight / capacity) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="text-indigo-500" />
                      Selected Items
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {optimizedResult.items.map((item) => (
                        <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Selected: {item.selectedWeight.toFixed(2)}kg, ${item.selectedValue.toFixed(2)}
                              </p>
                            </div>
                            {isFractional && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {Math.round(item.fraction * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-500" />
                  Portfolio Optimizer
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-700 mb-3">Add Stock</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder="Stock name"
                        value={stockName}
                        onChange={(e) => setStockName(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Cost per share ($)"
                          value={stockCost}
                          onChange={(e) => setStockCost(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Expected return ($)"
                          value={stockReturn}
                          onChange={(e) => setStockReturn(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={addStock}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add Stock
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={optimizePortfolio}
                    disabled={stocks.length === 0}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Calculator size={20} />
                    Optimize Portfolio
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Stock List</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stocks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No stocks added yet</p>
                  ) : (
                    stocks.map((stock) => (
                      <div key={stock.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{stock.name}</p>
                          <p className="text-sm text-gray-600">
                            ${stock.weight}, Return: ${stock.value} (ROI: {((stock.ratio - 1) * 100).toFixed(1)}%)
                          </p>
                        </div>
                        <button
                          onClick={() => removeStock(stock.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {portfolioResult && (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <PieChart className="text-green-500" />
                      Portfolio Results
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Total Investment:</span>
                        <span className="font-bold text-blue-600">${portfolioResult.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Expected Return:</span>
                        <span className="font-bold text-green-600">${portfolioResult.totalReturn.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">ROI:</span>
                        <span className="font-bold text-purple-600">
                          {((portfolioResult.totalReturn / portfolioResult.totalCost - 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium">Budget Used:</span>
                        <span className="font-bold text-orange-600">
                          {((portfolioResult.totalCost / budget) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="text-indigo-500" />
                      Selected Stocks
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {portfolioResult.items.map((stock) => (
                        <div key={stock.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{stock.name}</p>
                              <p className="text-sm text-gray-600">
                                Investment: ${stock.selectedWeight.toFixed(2)}, Return: ${stock.selectedValue.toFixed(2)}
                              </p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {Math.round(stock.fraction * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
