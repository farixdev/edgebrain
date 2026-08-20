"use client";

import Link from "next/link";
import { ArticleLayout } from "@/components/ui/article-layout";

/**
 * Body copy only.
 *
 * ArticleLayout owns the H1, breadcrumbs, byline, disclosure, prose styling,
 * "Keep reading" block and closing CTA — all read from the registry entry for
 * this slug. Nothing here re-types the title, and nothing here adds its own
 * Section or reveal wrapper: the layout already wraps the body in one
 * `data-reveal`/`initial={false}` motion.div, so every word ships in the
 * server HTML.
 *
 * Number discipline, per the standing disclosure the layout renders above:
 * every figure below is either linked to its source or explicitly marked as an
 * illustration. The one external case — $15 price, $3 modelled, $11.50 actual,
 * 23% margin, top decile at 72% of spend — is linked to runcycles.io and is
 * described there as an anonymised worked example, which is how it is
 * described here. It is not our result and not our client. If you add a
 * figure, either link it or say whose estimate it is.
 */
export function LlmCostPerUserContent() {
  return (
    <ArticleLayout slug="llm-cost-per-user">
      <p>
        <strong>
          Your LLM cost per user is tokens per turn, times turns per session,
          times sessions per user per month, times the blended token rate, minus
          whatever your cache actually absorbs.
        </strong>{" "}
        Everything else is commentary. For a mid-weight assistant feature with
        retrieval, that arithmetic usually lands somewhere between one and four
        dollars per active user per month &mdash; and the p95 user costs five to
        ten times that, which is the number that decides whether the feature has
        a margin.
      </p>
      <p>
        The finance posts on this topic are correct and useless. They tell you
        gross margin matters, that token costs are variable rather than fixed,
        and that you should track cost per active user. None of them show the
        multiplication. This does.
      </p>

      <h2>How to calculate LLM cost per user, in one expression</h2>
      <p>
        Write it out with every input exposed. If a number is hidden inside
        another number, you cannot sensitivity-test it, and sensitivity is the
        entire value of the exercise.
      </p>
      <pre>
        <code>{`cost_per_user_month =
    sessions_per_user_month
  x sum_over_turns( input_tokens(turn) x effective_input_rate
                  + output_tokens(turn) x output_rate )

effective_input_rate =
    (1 - cache_hit_rate) x input_rate
  + cache_hit_rate x cached_read_rate`}</code>
      </pre>
      <p>
        Five inputs. Two of them are published by your provider and change
        without your permission. Two of them are architecture decisions you
        control. One of them &mdash; sessions per user per month &mdash; you
        cannot know before launch, and it is the one with the widest variance.
        Hold that thought.
      </p>

      <h3>A worked request path, framed as an illustration</h3>
      <p>
        Take a support-reply assistant inside a B2B product. An agent opens a
        ticket, the assistant drafts a reply against the company&rsquo;s own
        help centre, the agent pushes back a few times, then sends. This is an
        invented feature used to show the method, not a system we built for
        anyone.
      </p>
      <p>Count what actually goes over the wire on a single turn:</p>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Tokens</th>
            <th>Grows with</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>System prompt, style rules, tool definitions</td>
            <td>1,400</td>
            <td>Nothing &mdash; fixed per deploy</td>
          </tr>
          <tr>
            <td>Retrieved help-centre chunks (6 x 500)</td>
            <td>3,000</td>
            <td>k, chunk size, reranking</td>
          </tr>
          <tr>
            <td>Ticket thread and prior turns</td>
            <td>0 to 2,350</td>
            <td>Turn number &mdash; this is the trap</td>
          </tr>
          <tr>
            <td>The agent&rsquo;s current message</td>
            <td>120</td>
            <td>Nothing much</td>
          </tr>
          <tr>
            <td>Generated draft reply</td>
            <td>350 out</td>
            <td>Max tokens, verbosity</td>
          </tr>
        </tbody>
      </table>
      <p>
        The third row is where forecasts break. Conversation history is replayed
        in full on every turn, so a six-turn session does not cost six times the
        first turn. It costs the sum of a growing prefix. First turn: 4,520
        input tokens. Sixth turn: 6,870. Total for the session: roughly 34,200
        input tokens and 2,100 output tokens.
      </p>

      <h3>The multiplication</h3>
      <p>
        Twenty sessions per user per month gives 684,000 input tokens and 42,000
        output tokens per user. At an illustrative mid-tier rate of $2.50 per
        million input and $10 per million output &mdash; check live provider
        pricing before you quote anyone, because these move &mdash; that is
        about $1.71 of input and $0.42 of output. Call it{" "}
        <strong>$2.13 per active user per month</strong> before caching.
      </p>
      <p>
        Now apply a cache. The 4,400-token prefix of system prompt plus
        retrieved context is identical on every turn after the first. If cached
        reads price at roughly a tenth of fresh input and you land a 60% hit
        rate across all input tokens, the input line drops from $1.71 to about
        $0.79. The feature now costs roughly $1.21 per active user per month.
      </p>
      <p>
        That is the whole method. Six numbers, one multiplication, an afternoon.
        It is also, on its own, wrong &mdash; in a specific and predictable
        direction.
      </p>

      <h2>Why the average user is the wrong unit</h2>
      <p>
        The mean is a fine description of a normal distribution and a terrible
        description of a power law. AI feature usage is a power law. A small
        group of users runs the feature constantly, in longer sessions, on
        harder tickets, and they do not appear in your pilot cohort because your
        pilot cohort was picked for enthusiasm rather than volume.
      </p>
      <p>
        The clearest published worked example of this comes from{" "}
        <a
          href="https://runcycles.io/blog/ai-agent-unit-economics-cost-per-conversation-per-user-margin"
          rel="nofollow noopener"
        >
          Cycles&rsquo; write-up of AI agent unit economics
        </a>
        , where an anonymised B2B SaaS company priced a support copilot at $15
        per user per month and modelled $3 per user in LLM cost, targeting an
        80% gross margin. By month three the actual figure was $11.50 per user
        and the gross margin on the feature was 23%. Their distribution: 70% of
        users under $3 a month, 20% between $8 and $25, and 10% between $40 and
        $120. The top decile consumed 72% of total spend. One user, running
        automated tests against the copilot endpoint, cost $310 on their own.
      </p>
      <p>
        Treat that as an anonymised illustration, because that is how its author
        presents it. The shape is the point, and the shape is not
        controversial. When the top decile carries most of the bill, a
        mean-based forecast is not merely imprecise. It is structurally
        optimistic, because the mean you measured in the pilot is not the mean
        of the population you are about to onboard.
      </p>

      <h3>Model the p95, price against the mean</h3>
      <p>
        The practical fix is two forecasts, not one. Compute the mean-user cost
        for your P&amp;L. Then compute a p95 user &mdash; in our illustration,
        five times the sessions and ten turns instead of six, which lands near
        $18 to $21 a month against a $2 average &mdash; and check that number
        against your price. If the p95 user destroys the margin on their own,
        you have a pricing and a design problem, and no amount of prompt
        trimming fixes it.
      </p>
      <p>
        Do this before you build. Retrofitting economics into a shipped feature
        means changing what users already have, and users notice removals.
      </p>

      <h2>The four numbers people get wrong in the forecast</h2>
      <p>
        These are the errors we see repeatedly, in roughly descending order of
        damage.
      </p>
      <p>
        <strong>History replay.</strong> As above. Multiplying a first-turn cost
        by turn count under-reads a long session by 30% to 50%. Anything with
        tool calls is worse, because every tool result also joins the transcript
        and gets replayed.
      </p>
      <p>
        <strong>Retries and agent loops.</strong> A schema violation that
        triggers a retry doubles that turn. An agent that plans, calls, reads,
        and re-plans may issue four or five model calls per visible response.
        Forecast per model call, never per user-visible message.
      </p>
      <p>
        <strong>Output token rates.</strong> Output is typically priced three to
        five times higher than input, and reasoning models bill their thinking
        tokens as output. A feature that looks input-dominated on a token count
        can be output-dominated on the invoice. Multiply before you conclude.
      </p>
      <p>
        <strong>Non-user traffic.</strong> Evaluation runs, CI suites, and load
        tests bill to the same account. Untagged, your cost-per-user metric
        quietly includes your own engineering team.
      </p>

      <h2>The four levers that move the number before launch</h2>
      <p>
        Ordered by how much they move, with an honest note on which are cheap to
        retrofit and which are structural.
      </p>

      <h3>Context budget</h3>
      <p>
        Retrieved context is usually the largest single line, and most systems
        over-retrieve because k was set to twenty during a demo and never
        revisited. Six well-reranked chunks generally beat twenty mediocre ones
        on answer quality and cost a third as much. Set an explicit token budget
        per request, enforce it in code, and log every request that hits the
        ceiling.
      </p>
      <p>
        Cheap to retrofit. This is a config change plus a reranker, and it is
        the first thing we would touch on an existing feature. What makes it
        work is having something to measure against, which is the{" "}
        <Link href="/insights/rag-vs-fine-tuning">
          retrieval evaluation harness we argue for in the RAG piece
        </Link>{" "}
        &mdash; that article answers which technique to use, this one answers
        what it costs per head, and they need each other.
      </p>

      <h3>Model routing by task, not by tier</h3>
      <p>
        The common version of this lever is wrong. Teams route by a difficulty
        score, misclassify the hard cases, and ship worse answers to save
        pennies. Route by <em>task</em> instead, because tasks have knowable
        requirements. Query rewriting, intent classification, title generation,
        and summarising a retrieved chunk are small-model work with
        deterministic quality bars. The customer-facing draft is not.
      </p>
      <p>
        Done that way, routing frequently removes half the calls from the
        expensive model without touching the output users read. Moderately cheap
        to retrofit if your call sites already go through one wrapper. Expensive
        if every feature calls the SDK directly, which is the usual state of a
        codebase six months in.
      </p>

      <h3>Cache design as an architecture decision</h3>
      <p>
        Prompt caching is not a flag you turn on. It is a constraint on how you
        order a prompt, and it has to be designed in. Caches key on an exact
        prefix, so anything that varies must sit after everything that does not.
        A timestamp, a user name, or a randomised few-shot example placed at the
        top of a system prompt destroys the hit rate for every request.
      </p>
      <p>
        The rules that matter: stable system prompt and tool definitions first,
        then retrieved context ordered deterministically, then the volatile
        turn. Hold retrieval output stable across a session rather than
        re-retrieving on every message. Watch your provider&rsquo;s cache TTL
        &mdash; a five-minute window rewards session bursts and gives you
        nothing on a user who returns after lunch.
      </p>
      <p>
        This is the lever that is genuinely expensive to retrofit. Reordering a
        prompt changes model behaviour, which means re-running your evaluation
        set, which means you needed an evaluation set. Design it in on day one
        or accept that you will pay to redo it.
      </p>

      <h3>A hard per-user ceiling, enforced in code</h3>
      <p>
        Every one of the runaway-cost stories has the same root cause: nothing
        in the system was allowed to say no. Meter tokens per user per billing
        period in your own database, not in the provider dashboard, and put
        three thresholds on it. A soft alert at maybe 3x your modelled average.
        A degradation step &mdash; smaller model, tighter context, no
        speculative pre-fetch &mdash; at 5x. A hard stop with an honest message
        at 10x.
      </p>
      <p>
        Cheap to retrofit and the highest-value hour of work on this list. The
        ceiling is also what makes seat pricing survivable, because it converts
        an unbounded liability into a known one.
      </p>

      <h2>Per seat, per usage, or credits</h2>
      <p>
        Seat pricing is the default because buyers understand it. It is also a
        bet that your cost distribution is tight, and for AI features it usually
        is not. Seats work once you have enforced a ceiling and the feature is a
        bounded add-on rather than the whole product.
      </p>
      <p>
        Usage pricing aligns cost and revenue perfectly and creates a worse
        product. Users billed per action ration their usage, and a rationed AI
        feature never becomes habitual enough to defend a renewal. We would
        rather absorb variance than teach people to hesitate.
      </p>
      <p>
        Credits are the compromise, and the compromise mostly works: an
        allowance inside the seat price sized at roughly your p75 user, with
        overage that is visible but not punitive. What we would refuse to build
        is a credit system where the exchange rate between a credit and a token
        is undocumented. That is not pricing, it is obfuscation, and it corrodes
        trust the first time a customer does the arithmetic.
      </p>

      <h2>Where this method breaks, including for us</h2>
      <p>
        The honest limitation: the input with the largest effect on the answer
        is the one you know least about. Sessions per user per month is
        behavioural. It depends on where the feature sits in the interface,
        whether it is opt-in, and whether it is fast enough to feel free. A
        pre-launch forecast can be wrong on that variable by 5x, and being wrong
        by 5x on the dominant term means the output is not a prediction.
      </p>
      <p>
        So do not treat the number as a forecast. Treat it as a sensitivity
        model whose job is to answer one question: is there any plausible usage
        level at which this feature is margin-negative at our intended price? If
        the answer is no across a 10x range of session counts, ship and
        instrument. If the answer is yes at 3x, you have a design problem to
        solve before launch, not a monitoring problem to solve after it.
      </p>
      <p>
        The second limitation is ours specifically. We can build the request
        path and the metering, and tell you what the arithmetic says. We cannot
        tell you what your users will do with a capability they have never had.
        Anyone quoting a confident per-user number for an unlaunched feature is
        quoting you their assumptions with your logo on them.
      </p>

      <h2>When not to build this at all</h2>
      <p>
        If your AI feature is a chat box over your own documentation, serving
        under a few thousand sessions a month, do not commission a custom build
        and do not commission a cost model for it. The assistant features already
        bundled into the major SaaS platforms and the retrieval built directly
        into the model APIs cover that case for less than the cost model would
        take to write, and somebody else upgrades the model underneath you.
      </p>
      <p>
        The arithmetic here starts earning its keep at roughly the point where
        the monthly LLM bill exceeds the cost of an engineer thinking about it
        &mdash; a few thousand dollars a month, or a few thousand daily active
        users, whichever arrives first. Below that line, ship something and find
        out what people do with it.
      </p>
      <p>
        Above that line, the decisions compound. Cache-friendly prompt ordering,
        a routing layer, and per-user metering are all cheaper to design in than
        to add, which is why we would rather have this conversation before the
        build than after. That is most of what a{" "}
        <Link href="/services/ai-consulting">
          short AI architecture and readiness engagement
        </Link>{" "}
        is for, and the build that follows is ordinary{" "}
        <Link href="/services/ai-automation">
          retrieval and workflow automation engineering
        </Link>
        .
      </p>

      <h2>What to instrument on day one</h2>
      <p>
        You cannot manage a distribution you cannot see, and the provider
        dashboard shows you an account total. Log one row per model call, in
        your own database, with these fields: user or tenant id, feature name,
        model, input tokens, cached-read tokens, output tokens, latency,
        whether it was a retry, and a traffic-source tag separating real users
        from evaluation and CI runs.
      </p>
      <p>
        Then report percentiles rather than averages: p50, p90, p99 cost per
        active user, refreshed weekly. A dashboard showing a single mean looks
        calm right up until the month the invoice is not. Langfuse and Helicone
        do this off the shelf; the schema above is a day of work if you would
        rather own it.
      </p>
      <p>
        What a build like this costs to commission, as opposed to run, is a
        different question &mdash; taken apart in{" "}
        <Link href="/insights/mvp-development-cost">
          what building an MVP actually costs
        </Link>
        . The{" "}
        <Link href="/work">reference builds we publish</Link> show the shape of
        the systems this method is written for.
      </p>

      <h2>The compressed version</h2>
      <p>
        Count the tokens on one real request path, including the system prompt,
        the retrieved context, and the history that gets replayed. Multiply by
        turns, then by sessions, then by rate. Divide the input line by your
        realistic cache hit rate rather than your hoped-for one. Then throw the
        mean away and run the same arithmetic for a user at the 95th percentile,
        because that user is the one who decides whether you have a margin.
      </p>
      <p>
        Fix the context budget, route by task, order the prompt for the cache,
        and put a ceiling in the code. Instrument percentiles from the first
        request. If any of that looks like a conversation worth having about a
        feature you have not shipped yet,{" "}
        <Link href="/contact">send us the request path</Link> and we will do the
        multiplication with you.
      </p>
    </ArticleLayout>
  );
}
