class MockRequest {
  constructor(public url: string, public init?: RequestInit) {}
}

export class NextRequest extends MockRequest {
  constructor(input: string | URL, init?: RequestInit) {
    super(typeof input === 'string' ? input : input.toString(), init);
  }
}

export class NextResponse {
  static json(body: any, init?: ResponseInit) {
    return {
      ...init,
      body: JSON.stringify(body),
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
      },
    };
  }
}