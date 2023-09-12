import { createPool as cp } from "slonik";
import makeInterceptor from "./interceptor";

const createPool = () => cp(
  process.env.DATABASE_URL!,
  {
    interceptors: [
      makeInterceptor()
    ]
  }
);

export default createPool;
