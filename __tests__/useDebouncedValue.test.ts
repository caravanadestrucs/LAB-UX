// Unit tests for useDebouncedValue (HU05 glosario search).
// Covers: 300ms default debounce, only the last value wins, timer cleanup.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedValue (HU05)", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("ux"));
    expect(result.current).toBe("ux");
  });

  it("does not update before the 300ms delay elapses", () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v), {
      initialProps: { v: "a" },
    });
    rerender({ v: "ab" });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("a");
  });

  it("publishes the value once the 300ms delay elapses", () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v), {
      initialProps: { v: "a" },
    });
    rerender({ v: "ab" });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("ab");
  });

  it("only publishes the last value when typing fast (single fetch)", () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v), {
      initialProps: { v: "u" },
    });
    rerender({ v: "us" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ v: "usa" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ v: "usab" });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("usab");
  });

  it("clears the pending timer on unmount (no setState after unmount)", () => {
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    const { rerender, unmount } = renderHook(({ v }) => useDebouncedValue(v), {
      initialProps: { v: "a" },
    });
    rerender({ v: "ab" });
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
