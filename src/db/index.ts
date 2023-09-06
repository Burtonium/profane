import { createPool } from "slonik";
import makeInterceptor from "./interceptor";

export default () => createPool(
  process.env.DATABASE_URL!,
  {
    interceptors: [
      makeInterceptor()
    ]
  }
);

