import "~/src/global.css"

import { Button } from "~src/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~src/components/ui/card"

// Access using: chrome-extension://bbipjgmdemdiojmofhlbibilkhpkblig/tabs/block-content.html
function BlockContentPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>This site is blocked</CardTitle>
        <CardDescription>
          You have attempted to access a blocked site.
        </CardDescription>
      </CardHeader>

      {/* <CardContent>Blocked content</CardContent> */}

      <CardFooter>
        <Button>Go Back</Button>
      </CardFooter>
    </Card>
  )
}

export default BlockContentPage
