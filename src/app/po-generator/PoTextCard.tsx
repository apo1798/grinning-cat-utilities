import { Check, ChevronDown, ChevronUp, Copy, FileWarning } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type Props = {
  textArray: Array<Array<string>>;
  number: number;
  isLast: boolean;
};

const PoTextCard = ({ textArray, number, isLast }: Props) => {
  const [isCardOpen, setIsCardOpen] = useState(true);
  const [isCopySuccess, setIsCopySuccess] = useState(false);
  const timerRef = useRef<number | null>(null);

  let hasNoMatchingValue = false;
  const generatedText =
    textArray
      .map((text) => {
        const matchingValue = text.at(number + 1);

        if (!matchingValue && !isLast) {
          hasNoMatchingValue = true;
        }

        return `msgid "${text.at(0)}"\nmsgstr "${matchingValue ?? ""}"\n`;
      })
      .join("\n") + "\n";

  return (
    <Collapsible open={isCardOpen} onOpenChange={setIsCardOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="space-x-2">
            <span>PO Section {number + 1}</span>
            {hasNoMatchingValue && (
              <span className="inline-flex items-center gap-1 text-sm text-red-500">
                <FileWarning className="h-4 w-4" />
                這裡有遺失的值喔！
              </span>
            )}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  aria-label="copy"
                  className="px-2"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(generatedText);
                      setIsCopySuccess(true);

                      timerRef.current = window.setTimeout(
                        () => setIsCopySuccess(false),
                        2000,
                      );
                    } catch (e) {
                      //pass
                    }
                  }}

                  // variant={isCopySuccess ? "outline" : "default"}
                >
                  {isCopySuccess ? (
                    <Check className="h-6 w-6 text-green-700" />
                  ) : (
                    <Copy className="h-6 w-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>複製</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="mx-6 mb-4 whitespace-pre rounded border-2 border-primary p-2 text-sm">
            {generatedText}
          </CardContent>
        </CollapsibleContent>
        <CardFooter>
          <CollapsibleTrigger asChild>
            <Button
              className="inline-flex w-full justify-between"
              variant="ghost"
            >
              <span>{isCardOpen ? "收合" : "展開"}</span>
              <span>{isCardOpen ? <ChevronUp /> : <ChevronDown />}</span>
            </Button>
          </CollapsibleTrigger>
        </CardFooter>
      </Card>
    </Collapsible>
  );
};
export default PoTextCard;