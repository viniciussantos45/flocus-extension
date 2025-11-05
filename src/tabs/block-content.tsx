import "~/src/global.css"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "~src/components/ui/card"

// Access using: chrome-extension://bbipjgmdemdiojmofhlbibilkhpkblig/tabs/block-content.html
function BlockContentPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>You cannot access this site right now.</CardTitle>
        <CardDescription>
          We are working to restore your mind. Prevent you from consuming cheap
          dopamine.
        </CardDescription>
      </CardHeader>

      {/* <CardContent>Blocked content</CardContent> */}
    </Card>
  )
}

export default BlockContentPage
