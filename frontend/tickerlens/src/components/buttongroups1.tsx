import { Button } from "@/components/ui/button";

export default function Basic() {
  return (
    <>
      <div className="isolate flex -space-x-px">
        <Button variant="outline" className="rounded-r-none focus:z-10">
          Prev
        </Button>
        <Button variant="outline" className="rounded-none focus:z-10">
          Now
        </Button>
        <Button variant="outline" className="rounded-l-none focus:z-10">
          Next
        </Button>
      </div>
    </>
  );
}
