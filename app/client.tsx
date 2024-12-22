"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HomeClient = () => {
  const [state, setState] = useState("a");

  useEffect(() => {
    console.log("latest state", state);
    return () => {
      console.log("stale state", state);
    };
  }, [state]);

  return (
    <div className="space-x-1.5 p-1 border rounded-md">
      <Button
        className={cn(state === "a" && "border-yellow-500")}
        onClick={() => setState("a")}
        size="icon"
        variant="outline"
      >
        a
      </Button>
      <Button
        className={cn(state === "b" && "border-yellow-500")}
        onClick={() => setState("b")}
        size="icon"
        variant="outline"
      >
        b
      </Button>
      <Button
        className={cn(state === "c" && "border-yellow-500")}
        onClick={() => setState("c")}
        size="icon"
        variant="outline"
      >
        c
      </Button>
      <Button
        className={cn(state === "d" && "border-yellow-500")}
        onClick={() => setState("d")}
        size="icon"
        variant="outline"
      >
        d
      </Button>
    </div>
  );
};

export default HomeClient;
