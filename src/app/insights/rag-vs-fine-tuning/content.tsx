"use client";

import Link from "next/link";
import { ArticleLayout } from "@/components/ui/article-layout";

/**
 * Body copy only.
 *
 * ArticleLayout owns the H1, breadcrumbs, byline, disclosure, prose styling,
 * "Keep reading" block and closing CTA — all read from the registry entry for
 * this slug. So nothing here re-types the title, and nothing here adds its own
 * Section or reveal wrapper: the layout already wraps the whole body in one
 * `data-reveal`/`initial={false}` motion.div, which keeps all ~2,100 words
 * present in the server HTML for crawlers.
 *
 * Number discipline, per the standing disclosure the layout renders above this:
 * every figure below is either linked to its source or explicitly marked as our
 * own estimate. This article links to no external source, so every range in it
 * is labelled as ours. We have not run a proprietary fine-tuning benchmark, so
 * no number here is presented as one. If you add a figure, either link it or
 * say whose estimate it is — the disclosure is a promise, not a slogan.
 */
export function RagVsFineTuningContent() {
  return (
    <ArticleLayout slug="rag-vs-fine-tuning">
      <p>
        <strong>Most teams asking this question need neither.</strong> If your
        LLM feature returns wrong, vague, or stale answers, the defect is almost
        always in retrieval, chunking, or the fact that you have no evaluation
        set. Fine-tuning on top of a broken retriever does not remove the
        wrongness. It makes the wrongness fluent, which is worse, because fluent
        errors survive review.
      </p>
      <p>
        The rule that holds most of the time: RAG for knowledge, fine-tuning for
        behaviour, prompting for everything you have not seriously tried yet.
        And the cost gap between the two is not the training run. It is the
        maintenance, which recurs every time your source data changes.
      </p>

      <h2>Diagnose the failure before you pick the fix</h2>
      <p>
        Four failure classes cover nearly everything. Run this before you
        commit a quarter to either approach. It takes an afternoon.
      </p>

      <table>
        <thead>
          <tr>
            <th>What you observe</th>
            <th>Cheapest test</th>
            <th>What it means</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Confidently wrong on your own facts</td>
            <td>Paste the right paragraph in, re-ask</td>
            <td>Retrieval, not the model</td>
          </tr>
          <tr>
            <td>Right facts, wrong shape or voice</td>
            <td>Stricter system prompt, three worked examples</td>
            <td>Prompting first, tuning only if that fails</td>
          </tr>
          <tr>
            <td>Citations look related but miss the answer</td>
            <td>Recall at ten, by hand, fifty questions</td>
            <td>Chunking and search strategy</td>
          </tr>
          <tr>
            <td>Arguing over whether last week helped</td>
            <td>None &mdash; you have no harness yet</td>
            <td>Build the eval set before anything else</td>
          </tr>
        </tbody>
      </table>

      <h3>Missing knowledge</h3>
      <p>
        Paste the correct source paragraph into the prompt and re-ask. If the
        answer becomes correct, the model was never the problem. This is a
        retrieval failure, the most common one by a wide margin, and fine-tuning
        is the expensive wrong answer.
      </p>

      <h3>Wrong tone, format, or structure</h3>
      <p>
        The facts are right and the shape is wrong. It will not stop
        apologising. It ignores your JSON schema one time in twenty. If a
        stricter system prompt with three worked examples fixes that, ship it.
        If schema violations survive real prompt work at scale, this is where
        fine-tuning genuinely earns its cost.
      </p>

      <h3>Retrieval that looks fine and is not</h3>
      <p>
        The cited chunks are topically related but do not contain the answer.
        For fifty real questions, check by hand whether the correct passage
        appears anywhere in the top ten retrieved chunks. If recall at ten is
        under roughly 0.85, stop everything else. Nothing downstream rescues a
        retriever that never surfaces the answer.
      </p>
      <p>
        The culprits are dull and fixable: fixed-size chunking that splits
        tables mid-row, embedding-only search that cannot match identifiers like
        part numbers or clause references, and no reranking pass. If your corpus
        is PDFs and scans, the damage usually starts at parsing, which is its
        own subject &mdash; see{" "}
        <Link href="/insights/automate-document-processing">
          how to automate document processing without a data team
        </Link>
        .
      </p>

      <h3>No evaluation</h3>
      <p>
        You are arguing about whether last week&rsquo;s prompt change helped. If
        you cannot answer that with a number, you have a measurement problem,
        not a model problem, and every decision after it is a guess.
      </p>

      <h2>What RAG actually costs, input by input</h2>
      <p>Four cost lines, and only one of them is the model.</p>
      <p>
        <strong>Ingestion</strong> is a one-off per document version. A 40-page
        PDF is roughly 20,000 to 30,000 tokens of text, so embedding it costs a
        fraction of a cent at prevailing rates. Parsing and chunking it well is
        where the hours go. Our own estimate: budget about a day of engineering
        per genuinely awkward source format, not per document.
      </p>
      <p>
        <strong>Storage</strong> is nearly free until it is not. A million
        chunks at 1,024 dimensions in float32 is about 4 GB of vectors, which
        pgvector on a Postgres you already run handles. Past roughly ten million
        chunks you are buying a dedicated store and an operator for it.
      </p>
      <p>
        <strong>Query time</strong> is the recurring line, and it multiplies
        against every call. Six chunks of 500 tokens each adds 3,000 input
        tokens to every request. At a million calls a month that is three
        billion input tokens of pure retrieval overhead. That number, not the
        training run, is what a fine-tune competes against.
      </p>
      <p>
        <strong>Refresh</strong> is where RAG wins outright. Updating knowledge
        means re-embedding the documents that changed. Minutes, on a cron, with
        no redeploy and no suite to re-run.
      </p>

      <h2>What a fine-tune actually costs</h2>
      <p>Also four lines, and the training run is the smallest of them.</p>
      <p>
        <strong>Data curation</strong> dominates. Our own estimate for LoRA on a
        task-specific behaviour is 200 to 500 curated examples as a starting
        point &mdash; a working number from our reading of the
        parameter-efficient fine-tuning literature, not a benchmark we ran.
        Writing and reviewing one good example takes five to fifteen minutes,
        once you count the disagreements about what the right answer even is.
        Three hundred
        examples is 25 to 75 hours of skilled attention. That is the real
        invoice.
      </p>
      <p>
        <strong>The training run</strong> is cheap. A LoRA adapter on a 7B to 8B
        open model typically fits in one to four hours on a single A100 or H100,
        which at prevailing rental rates is tens of dollars, not thousands.
        Hosted fine-tuning APIs price per training token and land in a similar
        range at this size. Check live rates before quoting anyone.
      </p>
      <p>
        <strong>Serving</strong> is the line people forget. A hosted fine-tune
        usually carries a per-token premium. Self-hosting an adapter means you
        own a GPU that must stay warm, or a cold start your users will feel.
      </p>
      <p>
        <strong>Refresh</strong> is the killer. Every time the underlying
        knowledge changes you retrain, re-evaluate, and redeploy. Our own
        estimate puts a knowledge refresh at roughly ten to a hundred times the
        cost of the RAG equivalent. The width of that range is the honest
        part: it depends entirely on how much of your curated dataset each
        change invalidates.
      </p>

      <h2>Break-even, and why a single month figure is dishonest</h2>
      <p>
        Break-even is where recurring RAG token overhead exceeds the amortised
        cost of a fine-tune. Write it out with every input exposed, then put
        your own numbers in:
      </p>
      <pre>
        <code>{`RAG per month  = calls x retrieved_tokens x input_rate + infra

Tune per month = (curation_hours x loaded_rate + gpu_cost)
                 / months_until_retrain
                 + calls x serving_premium`}</code>
      </pre>
      <p>
        An illustration, not a case study: at 500,000 calls a month with 3,000
        retrieved tokens each, RAG carries 1.5 billion input tokens a month of
        overhead. Against a fine-tune costing forty hours of curation plus a
        trivial GPU bill, amortised over six months, the fine-tune looks cheaper
        on paper.
      </p>
      <p>
        Now change one input. If your documents change monthly rather than every
        six months, the amortisation window collapses and the fine-tune is
        roughly six times more expensive. If prompt caching removes most of the
        retrieval overhead, RAG wins immediately. If your call volume is 50,000
        rather than 500,000, RAG wins by an order of magnitude.
      </p>
      <p>
        This is why we distrust any article naming a break-even month.
        Break-even is dominated by two variables, refresh frequency and call
        volume, and both are yours. Sensitivity-test them before believing any
        number, including the one above.
      </p>

      <h2>RAG vs fine-tuning latency</h2>
      <p>
        A fine-tuned model is faster per request. The gap is real and usually
        smaller than people expect.
      </p>
      <p>
        Added retrieval latency runs roughly 200 to 800 milliseconds per RAG
        query, on our own estimate. Where we think that budget goes: embedding
        the query is typically 20 to 60 ms, vector search is often under 50 ms
        on a warm index, and the rest is network hops, a reranker if you use
        one, and prefill on the extra 3,000 injected tokens. That last
        item is the one you can actually shrink.
      </p>
      <p>
        The mitigations, in the order we would try them. Cut the retrieved
        chunk count and add a reranker, so six good chunks beat twenty mediocre
        ones. Run retrieval concurrently with other pre-call work. Cache the
        system preamble. Then stream the response, so time to first token rather
        than total latency is what the user feels &mdash; a front-end decision
        as much as a model one, and part of why we treat streaming states as{" "}
        <Link href="/services/web-development">product interface work</Link>.
      </p>
      <p>
        If you have a hard sub-second budget and are already down to six
        reranked chunks, that is a legitimate reason to look at a tuned model.
        It is one of the few.
      </p>

      <h2>Build the evaluation harness first</h2>
      <p>
        This is the section that changes outcomes and the part almost everyone
        skips. Without a harness you cannot tell whether fine-tuning helped, or,
        more expensively, whether it hurt.
      </p>

      <h3>The golden set</h3>
      <p>
        Between 100 and 300 real questions, taken from user logs or from the
        people who answer them by hand today. Not questions you invented,
        because invented questions are always the ones your system already
        handles. Each row carries the question, the passage containing the
        answer, an acceptable answer, and a label for its part of the corpus.
      </p>
      <p>
        Include the awkward cases deliberately. Questions with no answer in the
        corpus. Questions whose answer changed last quarter. Questions needing
        two documents combined. Roughly a fifth of the set should be cases where
        the correct response is a refusal, because a system that never says it
        does not know will eventually say something expensive.
      </p>

      <h3>Measure retrieval separately from generation</h3>
      <p>
        This is the discipline most harnesses lack, and it is exactly why teams
        misdiagnose. Score the retriever on its own: recall at k, meaning
        whether the gold passage appears at all, and mean reciprocal rank,
        meaning how high it sits. Then score the generator given perfect
        retrieval, by feeding it the gold passage directly.
      </p>
      <p>
        Two numbers, two verdicts. If retrieval recall is 0.6, no amount of
        model work matters. If retrieval is 0.95 and answers are still wrong
        with the gold passage in hand, you have a genuine model or prompt
        problem &mdash; and only now is fine-tuning rational to discuss. Teams
        reporting one blended accuracy score cannot make this call at all.
      </p>

      <h3>Grading, and its limits</h3>
      <p>
        Using a model as judge is workable for scoring faithfulness and
        relevance at volume, and it is what we use. It is also biased toward
        verbose answers and agrees with itself far more readily than it agrees
        with you. So calibrate it: have a person grade fifty rows, measure
        agreement, and adjust the rubric until the judge matches on four out of
        five. Re-check whenever you change judge models. Anyone telling you a
        grader needs no human calibration is selling the grader.
      </p>

      <h3>Wire it into CI</h3>
      <p>
        A harness that runs when someone remembers is worthless. Every prompt
        change, model version bump, and chunking parameter change should run the
        suite and print a diff per metric. Ragas and promptfoo do this off the
        shelf and DeepEval covers similar ground, so it is a day of work, not a
        platform decision. Vendors ship new model versions on their own
        schedule, and a silent regression on a Tuesday is what this catches.
      </p>

      <h2>When we would fine-tune</h2>
      <p>Three cases, and they are narrower than the market implies.</p>
      <p>
        <strong>Rigid output format at high volume</strong>, where a one percent
        schema violation rate is operationally expensive and carrying few-shot
        examples in every prompt costs more in input tokens than a tuned model
        costs in total.
      </p>
      <p>
        <strong>A specialist idiom the base model lacks.</strong> An internal
        taxonomy with fifty overlapping categories. A domain shorthand. A house
        voice you can demonstrate but cannot describe.
      </p>
      <p>
        <strong>Distillation for cost or latency.</strong> A frontier model
        already does a narrow, stable, high-volume task well and you want a
        small open model doing it far cheaper. This is the most defensible
        fine-tuning case there is, because you already have a system generating
        the training data and a system to benchmark against.
      </p>
      <p>
        What we would not do is fine-tune to teach a model facts. Facts change.
        Weights do not, without another training run. Making that call before
        anyone writes code is most of what our{" "}
        <Link href="/services/ai-consulting">
          AI architecture and readiness consulting
        </Link>{" "}
        is for; the build that follows is ordinary{" "}
        <Link href="/services/ai-automation">
          retrieval and workflow automation engineering
        </Link>
        .
      </p>

      <h2>When you should not hire us, or anybody</h2>
      <p>
        If your corpus is under a few thousand documents, your users are
        internal, and your volume is a few thousand queries a month, buy
        something instead. The document-chat features inside the major assistant
        products, and the retrieval built into the model APIs themselves, cover
        that for a fraction of a custom build &mdash; and somebody else patches
        them and upgrades the model underneath.
      </p>
      <p>
        Spend a week trying to hit your quality bar with an off-the-shelf tool
        and a carefully written prompt first. If it works, you have saved a
        quarter. If it does not, you have a concrete list of what it could not
        do, which is a better brief than you would have written otherwise.
      </p>
      <p>
        Custom retrieval starts earning its keep when you need hybrid keyword
        and vector search over identifiers, permissions that follow your
        existing access rules, paragraph-level citations for audit, or ingestion
        from systems no connector supports. Those are engineering problems.
        Everything short of them is a subscription.
      </p>

      <h2>The hybrid case, honestly</h2>
      <p>
        Hybrid means a tuned small model reading retrieved context: the model
        learns the format and the idiom, retrieval supplies the facts. A real
        end state, and for some systems the right one. It is also two systems to
        evaluate and two ways to regress. Build it second. Teams that start
        hybrid cannot tell which half is failing, which puts them back at the
        measurement problem they began with.
      </p>

      <h2>The compressed decision</h2>
      <p>
        Fix retrieval and evaluation first. Ship RAG for knowledge, because
        knowledge changes and re-embedding a document is cheaper than retraining
        a model. Fine-tune for behaviour that is stable, narrow, and high in
        volume, and only once a harness proves the generator rather than the
        retriever is what fails. Then measure again, because the only number
        worth trusting is the one from your own corpus.
      </p>
    </ArticleLayout>
  );
}
