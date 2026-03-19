"use client";

import { useEffect, useState } from "react";
import Title from "./components/title";

const name = "/Colby/Chance";
const joke = "/Colby/Cheese";
const common = "/Colby/Ch";

// 1) Type the joke
// 2) Backspace the joke to the common prefix
// 3) Type name correctly
const State = {
    FORWARD_JOKE: 0,
    BACKWARD_JOKE: 1,
    FORWARD_NAME: 2,
    DONE: 3,
} as const;

export default function Home() {
    // Initialize to "/" so the element doesn't pop in
    const [displayedText, setDisplayedText] = useState("/");
    const [state, setState] = useState<(typeof State)[keyof typeof State]>(
        State.FORWARD_JOKE,
    );
    useEffect(() => {
        const timeout = setTimeout(() => {
            switch (state) {
                case State.FORWARD_JOKE: {
                    if (displayedText === joke) {
                        setState(State.BACKWARD_JOKE);
                    } else {
                        setDisplayedText((prev) =>
                            joke.slice(0, prev.length + 1),
                        );
                    }
                    break;
                }
                case State.BACKWARD_JOKE: {
                    if (displayedText === common) {
                        setState(State.FORWARD_NAME);
                    } else {
                        setDisplayedText((prev) =>
                            joke.slice(0, prev.length - 1),
                        );
                    }
                    break;
                }
                case State.FORWARD_NAME: {
                    if (displayedText === name) {
                        setState(State.DONE);
                    } else {
                        setDisplayedText((prev) =>
                            name.slice(0, prev.length + 1),
                        );
                    }
                    break;
                }
                case State.DONE: {
                    // do nothing
                    break;
                }
                default: {
                    throw new Error("Unhandled state");
                }
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, [displayedText, state]);

    return (
        <div>
            <Title>{displayedText}</Title>
            <p className="mb-4 motion-safe:animate-enter">
                {
                    "Hi! This is my personal site where I host my posts and slides."
                }
            </p>
        </div>
    );
}
