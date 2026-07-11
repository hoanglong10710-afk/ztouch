"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { CheckCircle2, XCircle, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const toastManager = ToastPrimitive.createToastManager()

export const toast = {
  success: (message: string) => toastManager.add({ title: message, type: "success" }),
  error: (message: string) => toastManager.add({ title: message, type: "error" }),
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return (
    <>
      {toasts.map((item) => (
        <ToastPrimitive.Root
          key={item.id}
          toast={item}
          data-slot="toast"
          className={cn(
            "relative rounded-xl border border-border bg-popover p-4 pr-9 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            item.type === "error" && "border-destructive/50"
          )}
        >
          <div className="flex items-start gap-2">
            {item.type === "success" && (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
            )}
            {item.type === "error" && (
              <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            )}

            <ToastPrimitive.Title className="font-medium" />
          </div>

          <ToastPrimitive.Close
            aria-label="Đóng"
            className="absolute top-2 right-2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon className="size-3.5" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
    </>
  )
}

function ToastViewport() {
  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport
        data-slot="toast-viewport"
        className="fixed inset-x-4 bottom-4 z-50 mx-auto flex w-full max-w-sm flex-col gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        <ToastList />
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  )
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      {children}
      <ToastViewport />
    </ToastPrimitive.Provider>
  )
}

export { ToastProvider }
