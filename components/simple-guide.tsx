import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export function SimpleGuide() {
  return (
    <div className="rounded-lg border p-4 bg-blue-50">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-lg">How to Use This Page</h3>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-base">How to create a bill?</AccordionTrigger>
          <AccordionContent className="text-base">
            <ol className="list-decimal list-inside space-y-2">
              <li>Fill in customer details on the left side</li>
              <li>
                Add glass items on the right side:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Select glass category</li>
                  <li>Choose glass type</li>
                  <li>Enter width and height</li>
                  <li>Select unit (mm, inch, feet, cm)</li>
                  <li>Enter quantity</li>
                  <li>Click "Add Item to Bill"</li>
                </ul>
              </li>
              <li>Review all items in the bill</li>
              <li>Click the "Print Bill" button to print</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-base">How to print a bill?</AccordionTrigger>
          <AccordionContent className="text-base">
            <ol className="list-decimal list-inside space-y-2">
              <li>After adding all items to the bill, click the blue "Print Bill" button</li>
              <li>A new window will open with the bill</li>
              <li>The print dialog will appear automatically</li>
              <li>Select your printer and click Print</li>
              <li>The bill will be saved in history automatically</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-base">How to create a quotation?</AccordionTrigger>
          <AccordionContent className="text-base">
            <ol className="list-decimal list-inside space-y-2">
              <li>Fill in customer details</li>
              <li>Add all glass items</li>
              <li>Instead of printing, click "Save as Quotation"</li>
              <li>The quotation will be saved and can be viewed in the History section</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-base">How to start a new bill?</AccordionTrigger>
          <AccordionContent className="text-base">
            <p>Click the "New Bill" button to clear all fields and start fresh with a new bill number.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
