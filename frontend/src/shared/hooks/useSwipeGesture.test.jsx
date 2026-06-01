import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useSwipeGesture } from "./useSwipeGesture";

function Probe({ onSwipeRight, onSwipeLeft, threshold }) {
  const ref = useSwipeGesture({ onSwipeRight, onSwipeLeft, threshold });
  return <div data-testid="swipe-area" ref={ref} style={{ width: 300, height: 200 }} />;
}

function touchEvent(clientX, clientY) {
  return { touches: [{ clientX, clientY }], changedTouches: [{ clientX, clientY }] };
}

describe("useSwipeGesture", () => {
  it("dispara onSwipeRight quando deltaX > threshold", () => {
    const onSwipeRight = vi.fn();
    const { getByTestId } = render(<Probe onSwipeRight={onSwipeRight} threshold={50} />);
    const el = getByTestId("swipe-area");

    fireEvent.touchStart(el, touchEvent(10, 100));
    fireEvent.touchEnd(el, touchEvent(120, 100));

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
  });

  it("dispara onSwipeLeft quando deltaX < -threshold", () => {
    const onSwipeLeft = vi.fn();
    const { getByTestId } = render(<Probe onSwipeLeft={onSwipeLeft} threshold={50} />);
    const el = getByTestId("swipe-area");

    fireEvent.touchStart(el, touchEvent(200, 100));
    fireEvent.touchEnd(el, touchEvent(50, 100));

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it("não dispara quando movimento é vertical", () => {
    const onSwipeRight = vi.fn();
    const { getByTestId } = render(<Probe onSwipeRight={onSwipeRight} threshold={50} />);
    const el = getByTestId("swipe-area");

    fireEvent.touchStart(el, touchEvent(100, 50));
    fireEvent.touchEnd(el, touchEvent(110, 200));

    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it("não dispara quando deltaX < threshold", () => {
    const onSwipeRight = vi.fn();
    const { getByTestId } = render(<Probe onSwipeRight={onSwipeRight} threshold={100} />);
    const el = getByTestId("swipe-area");

    fireEvent.touchStart(el, touchEvent(10, 100));
    fireEvent.touchEnd(el, touchEvent(60, 100));

    expect(onSwipeRight).not.toHaveBeenCalled();
  });
});
