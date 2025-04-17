// src/setupTests.js
import "@testing-library/jest-dom";

// Polyfill TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from "util";
import "whatwg-fetch";
import { BroadcastChannel } from "broadcast-channel"; 
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
