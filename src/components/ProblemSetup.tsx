import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Play } from "lucide-react";
import { Product, Operation } from "@/lib/qlearning";
import { toast } from "sonner";

interface ProblemSetupProps {
  onStart: (products: Product[], numMachines: number) => void;
}

export const ProblemSetup = ({ onStart }: ProblemSetupProps) => {
  const [numMachines, setNumMachines] = useState(3);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Produit 1",
      operations: [
        { productId: 1, machineId: 0, duration: 5, operationIndex: 0 },
        { productId: 1, machineId: 1, duration: 3, operationIndex: 1 },
      ],
    },
  ]);

  const addProduct = () => {
    const newId = Math.max(0, ...products.map(p => p.id)) + 1;
    setProducts([
      ...products,
      {
        id: newId,
        name: `Produit ${newId}`,
        operations: [
          { productId: newId, machineId: 0, duration: 5, operationIndex: 0 },
        ],
      },
    ]);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 1) {
      toast.error("Au moins un produit est requis");
      return;
    }
    setProducts(products.filter(p => p.id !== id));
  };

  const addOperation = (productId: number) => {
    setProducts(
      products.map(p => {
        if (p.id === productId) {
          const newOpIndex = p.operations.length;
          return {
            ...p,
            operations: [
              ...p.operations,
              {
                productId,
                machineId: 0,
                duration: 5,
                operationIndex: newOpIndex,
              },
            ],
          };
        }
        return p;
      })
    );
  };

  const removeOperation = (productId: number, opIndex: number) => {
    setProducts(
      products.map(p => {
        if (p.id === productId) {
          if (p.operations.length <= 1) {
            toast.error("Au moins une opération est requise par produit");
            return p;
          }
          return {
            ...p,
            operations: p.operations
              .filter((_, i) => i !== opIndex)
              .map((op, i) => ({ ...op, operationIndex: i })),
          };
        }
        return p;
      })
    );
  };

  const updateOperation = (
    productId: number,
    opIndex: number,
    field: keyof Operation,
    value: number
  ) => {
    setProducts(
      products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            operations: p.operations.map((op, i) =>
              i === opIndex ? { ...op, [field]: value } : op
            ),
          };
        }
        return p;
      })
    );
  };

  const handleStart = () => {
    // Validation
    if (numMachines < 1) {
      toast.error("Au moins une machine est requise");
      return;
    }

    for (const product of products) {
      for (const op of product.operations) {
        if (op.machineId < 0 || op.machineId >= numMachines) {
          toast.error(`Machine invalide pour ${product.name}`);
          return;
        }
        if (op.duration <= 0) {
          toast.error(`Durée invalide pour ${product.name}`);
          return;
        }
      }
    }

    onStart(products, numMachines);
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-primary">Configuration du Problème</CardTitle>
          <CardDescription>
            Définissez le nombre de machines et les produits avec leurs opérations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="numMachines">Nombre de machines</Label>
            <Input
              id="numMachines"
              type="number"
              min={1}
              max={10}
              value={numMachines}
              onChange={e => setNumMachines(parseInt(e.target.value) || 1)}
              className="max-w-xs"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Produits</Label>
              <Button onClick={addProduct} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Produit
              </Button>
            </div>

            {products.map(product => (
              <Card key={product.id} className="border-secondary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <Button
                      onClick={() => removeProduct(product.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.operations.map((op, opIndex) => (
                    <div
                      key={opIndex}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Machine</Label>
                            <Input
                              type="number"
                              min={0}
                              max={numMachines - 1}
                              value={op.machineId}
                              onChange={e =>
                                updateOperation(
                                  product.id,
                                  opIndex,
                                  "machineId",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Durée (unités)</Label>
                            <Input
                              type="number"
                              min={1}
                              value={op.duration}
                              onChange={e =>
                                updateOperation(
                                  product.id,
                                  opIndex,
                                  "duration",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeOperation(product.id, opIndex)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addOperation(product.id)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Opération
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={handleStart} className="w-full bg-gradient-primary" size="lg">
            <Play className="h-5 w-5 mr-2" />
            Démarrer l'Apprentissage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
