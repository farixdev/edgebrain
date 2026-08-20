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
 * data-reveal / initial={false} motion.div, so every word ships inside the
 * server HTML.
 *
 * Honesty discipline for this route in particular. Rescue work is the easiest
 * place on a software site to start inventing outcomes, so there are none here:
 * no recovered projects, no named systems, no percentages we did not measure.
 * The only price mentioned is the readiness sprint already published on
 * /services/ai-consulting, referenced as the *shape* of a paid assessment
 * rather than as a quote for a codebase audit. Do not add a new number.
 */
export function RewriteVsRefactorLegacyAppContent() {
  return (
    <ArticleLayout slug="rewrite-vs-refactor-legacy-app">
      <p>
        <strong>
          Refactor, unless you can name the specific architectural constraint
          that refactoring cannot reach.
        </strong>{" "}
        That rule survives almost every codebase you will be handed. In practice
        the honest answer is usually neither one wholesale: you strangle the
        system route by route behind the front door it already has, and you ship
        the entire time. A full rewrite is not a technical decision. It is a
        decision to stop shipping product for somewhere between six months and
        two years while you rebuild features your competitors already have.
      </p>
      <p>
        Before anyone argues about it, measure. Five signals, one working day,
        from a clean checkout on a machine that has never seen this project:
        dependency drift weighted by blast radius, where the business logic
        physically lives, coverage weighted by what it covers, whether the build
        reproduces, and whether the schema has stopped moving. The argument is
        normally unwinnable because nobody has measured the thing being argued
        about.
      </p>

      <h2>Stabilise before you assess</h2>
      <p>
        If the previous developer has gone, do this first. It is not the
        assessment; it is making sure there is something left to assess.
      </p>
      <ul>
        <li>
          Prove you can deploy &mdash; that a one-character change reaches
          production and can be reverted.
        </li>
        <li>
          Restore a backup into a scratch environment and open the application
          against it. An untested backup is a belief, not a backup.
        </li>
        <li>
          Rotate credentials, registrar and DNS first: days to recover, hours to
          lose.
        </li>
        <li>
          Inventory cron jobs, queues and inbound webhooks. Undocumented cron is
          where legacy systems keep their secrets.
        </li>
      </ul>

      <h2>Signal one: dependency drift, weighted by blast radius</h2>
      <p>
        Everyone counts outdated packages. The count is close to meaningless.
        What matters is which of them sit on the path of authenticated requests
        or untrusted input.
      </p>
      <p>
        Run <code>npm outdated</code> or <code>composer outdated</code> for
        drift, then <code>npm audit</code> or <code>pip-audit</code> for known
        vulnerabilities. Now discard everything that is not one of four things:
        the language runtime, the web framework, the authentication or session
        library, and anything that parses input you did not write &mdash; image
        processing, XML, PDF, archive extraction, deserialisation.
      </p>
      <p>
        Those four categories are the assessment. A build tool eleven versions
        behind is an afternoon. An unsupported runtime is a different class of
        problem: Node 18 left maintenance in April 2025 and Node 20 followed in
        April 2026, PHP 7.4 stopped receiving security fixes in late 2022,
        Python 3.8 in October 2024. Check the vendor&rsquo;s own support table
        rather than trusting this paragraph &mdash; those dates move and this
        article does not.
      </p>
      <p>
        Our threshold: two or more majors behind on the framework{" "}
        <strong>plus</strong> an unsupported runtime <strong>plus</strong> a
        hand-patched fork vendored into the repository is genuine rewrite
        pressure. Any one alone is a scheduled upgrade. The fork is the part
        people underweight: somebody already tried to upgrade, hit a wall, and
        paved over it.
      </p>

      <h2>Signal two: where does the business logic actually live</h2>
      <p>
        This decides the outcome more than any other signal, and almost nobody
        measures it. Pick three rules that would cost real money if they were
        wrong &mdash; how an invoice total is calculated, who may see a record,
        what happens when a subscription lapses &mdash; then find every place
        each one is implemented.
      </p>
      <p>
        A healthy codebase gives you one location per rule and a handful of call
        sites. A codebase in trouble smears it across a controller, a front-end
        component that re-implements it for the optimistic UI, a trigger nobody
        remembers writing, a nightly script that quietly corrects the other
        three, and a reporting query with the logic inlined in SQL.
      </p>
      <p>
        One implementation is fine. Two is normal. Four or more, for a rule that
        moves money, means you cannot change that rule safely by any method
        &mdash; precisely the pain most people mistake for needing a rewrite. A
        rewrite reproduces the smear, because the smear came from delivery
        pressure, not from the framework. Look especially for triggers and
        stored procedures: invisible to code search, they survive every
        application-layer rewrite, and they are the usual reason a finished
        rewrite produces different numbers from the system it replaced.
      </p>

      <h2>Signal three: coverage weighted by what it covers</h2>
      <p>
        A coverage percentage tells you nothing about an inherited codebase.
        Eighty percent line coverage achieved by exercising getters is worth
        less than nine tests around the payment path. Measure it differently:
        write down the ten invariants that must never break &mdash; totals
        reconcile, a user cannot read another tenant&rsquo;s data, a refund
        cannot exceed the original charge &mdash; then break each one
        deliberately in the source, run the suite, and count the red tests.
      </p>
      <p>
        Ten out of ten is a codebase you can refactor aggressively. Under three
        means you have no safety net whatever the badge says, and your first
        month is characterisation tests rather than changes. Mutation testing
        automates this &mdash; Stryker for JavaScript, PIT on the JVM, mutmut
        for Python, Infection for PHP &mdash; but point it at the money paths
        only. Across a whole legacy repository it produces a number so large and
        so slow nobody looks twice.
      </p>
      <p>
        Absent tests, though, are not a rewrite argument. Tests are cheaper to
        add to a working system than to write against one that does not exist
        yet, and a rewrite also starts at zero coverage &mdash; without the
        existing behaviour to compare against.
      </p>

      <h2>Signal four: does it build from a clean checkout</h2>
      <p>
        Take a machine with none of this project&rsquo;s history on it. Clone,
        install, run, stopwatch. Cheapest signal in the set, and the most
        predictive of what the next twelve months feel like.
      </p>
      <p>
        Under an hour from written instructions that turn out to be true: the
        previous team was competent and most of what looks like rot is surface.
        Under a day with guesswork: normal. More than two days, or only one
        person has ever made it run: treat every other estimate about this
        system as unreliable, because nobody has verified anything in isolation
        for a long time. Check for a committed lockfile that still resolves,
        base images pinned rather than <code>latest</code>, and secrets read
        from the environment rather than committed.
      </p>
      <p>
        Then run{" "}
        <code>git log --since=12.months --format=%an | sort | uniq -c</code>.
        Two contributors is a risk you can plan around. One, who has left, is
        the actual emergency &mdash; and it is organisational, not technical.
      </p>

      <h2>Signal five: has the schema stopped moving</h2>
      <p>
        The data model is the part a rewrite cannot escape. Application code can
        go a route at a time. The database is either shared by whatever replaces
        it, or migrated in one frightening step.
      </p>
      <p>
        Read the migration history for the last two years. Additive migrations
        &mdash; new tables, nullable columns, indexes &mdash; mean the model
        fitted the problem and the business grew into it. Repeated structural
        churn on the same core tables means it never fitted, and that is the
        strongest rewrite signal in this article.
      </p>
      <p>
        Then look for the smells: columns named <code>notes2</code>, a catch-all
        JSON column that has quietly become the real schema, missing foreign
        keys where relationships obviously exist, enumerations stored as free
        text with four spellings live in production. Run the orphan and
        duplicate counts before deciding. Low rates mean a sound model wearing a
        bad application, which is a refactor. If the data contradicts itself,
        rewriting the code above it changes nothing.
      </p>

      <h2>Reading the five signals together</h2>
      <table>
        <thead>
          <tr>
            <th>Signal</th>
            <th>Refactor territory</th>
            <th>Rewrite pressure</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dependency drift</td>
            <td>Behind, but an upgrade path exists</td>
            <td>Unsupported runtime plus vendored forks of core libraries</td>
          </tr>
          <tr>
            <td>Logic location</td>
            <td>One or two implementations per rule</td>
            <td>Four or more, including database triggers</td>
          </tr>
          <tr>
            <td>Invariant coverage</td>
            <td>Seven or more of ten break a test</td>
            <td>Under three, and the domain is undocumented</td>
          </tr>
          <tr>
            <td>Clean build</td>
            <td>Runs in under a day from written steps</td>
            <td>Only one person has ever made it run</td>
          </tr>
          <tr>
            <td>Schema stability</td>
            <td>Additive migrations, referential integrity holds</td>
            <td>Core tables restructured repeatedly, data contradicts itself</td>
          </tr>
        </tbody>
      </table>
      <p>
        The weighting is not equal. Signal five outranks the other four
        combined. Refactor when the data model is sound and the pain sits in the
        layers above it, which describes most inherited systems. Rewrite only
        when the constraint is structural and you can state it in one sentence
        without using the word messy.
      </p>

      <h3>Constraints that genuinely justify a rewrite</h3>
      <ul>
        <li>
          A single-tenant data model where the contract you just signed requires
          per-tenant isolation at the storage layer. A schema property, not a
          code property.
        </li>
        <li>
          A platform with no upgrade path at all, because the vendor shut the
          product down rather than deprecated an API.
        </li>
        <li>
          A consistency model the stack cannot express: transactional guarantees
          the storage engine does not offer, at a volume it cannot serve.
        </li>
        <li>A licence you cannot ship under, discovered late.</li>
      </ul>

      <h3>Reasons that are not constraints</h3>
      <p>
        The code is ugly. The team does not know this language. There are no
        tests. It uses jQuery. A new lead has arrived with opinions. Each is
        real friction; none is a reason to stop shipping for a year. Which stack
        you standardise on is a hiring question, and it looks different
        depending on{" "}
        <Link href="/insights/in-house-vs-agency-vs-freelancer">
          whether you build in-house, with an agency, or with freelancers
        </Link>
        .
      </p>

      <h2>Why a full rewrite is a decision to stop shipping</h2>
      <p>
        Here is the unpopular part. The cost that matters is not engineering
        hours. It is the feature freeze, charged in market position rather than
        in invoices.
      </p>
      <p>
        The freeze is never clean either. What happens instead is dual
        maintenance: the old system keeps taking urgent fixes because customers
        still use it, every fix is re-implemented in the new one, and the target
        keeps moving. Parity also includes undocumented behaviours some customer
        has built a workflow around. Those are not in the specification. They
        are in the old code &mdash; the artifact you decided not to read.
      </p>
      <p>
        An illustration, with invented numbers, showing shape rather than any
        real project: a system holding roughly eight engineer-years of behaviour,
        rewritten by three people, does not take eight months just because the
        team knows the domain. Call it fourteen to twenty months to parity with
        dual maintenance alongside, then ask what your competitors ship in that
        window. If the answer is nothing that matters, a rewrite may be
        affordable. Usually it is not.
      </p>
      <p>
        It is also why we are careful about how rescue work gets contracted: a
        fixed price on a system nobody has read yet carries a buffer sized by
        the unknowns, and those mechanics are set out in{" "}
        <Link href="/insights/fixed-price-vs-time-and-materials">
          fixed price versus time and materials
        </Link>
        .
      </p>

      <h2>Strangle it: route by route, behind the existing front door</h2>
      <p>
        The strangler fig pattern is the default for almost every system that
        passes signal five and fails one or two of the others. Put a routing
        layer in front of the existing application, then move one slice at a
        time behind it. The old system keeps serving everything you have not
        moved. Nothing freezes.
      </p>

      <h3>Put the seam in while it is boring</h3>
      <p>
        Week one is a reverse proxy in front of the current application, routing
        all traffic to it and doing nothing else. Nginx, a load balancer, an
        edge function &mdash; the implementation matters far less than the seam
        existing. If it cannot go in without breaking sessions, authentication
        or file uploads, you have learned something important cheaply.
      </p>

      <h3>Pick the first slice by risk, not by ambition</h3>
      <p>
        The first migrated route should be read-only, low-traffic and verifiable
        by eye. A public listing page. An internal report. The instinct is to
        start with checkout because checkout hurts most; resist it. The first
        slice exists to prove routing, deploys, observability and rollback
        somewhere that does not take payments.
      </p>

      <h3>Share the database before you split it</h3>
      <p>
        The new code reads and writes the same database the old code does. This
        is the part purists object to and it is what makes the pattern work: two
        applications, one source of truth, no dual-write bugs, no reconciliation
        job. Splitting the data store is a separate project needing its own
        justification. Deferring it is scope control, not debt.
      </p>

      <h3>Where this pattern stalls</h3>
      <p>
        Being honest about what we are recommending: a strangler migration
        stalls once the easy routes are done and only the tangled ones remain,
        and running two systems in parallel taxes every change. Give each
        cutover a documented way back &mdash; a routing flag rather than a
        deploy &mdash; and keep the remaining routes on a visible list with
        owners and dates. A stalled strangler is worse than either pure option,
        because now you maintain both.
      </p>

      <h2>When you should hire nobody at all</h2>
      <p>
        Some inherited applications should be neither rescued nor rewritten, but
        replaced with something you buy.
      </p>
      <p>
        If the system is a brochure site with a blog, a standard store without
        unusual fulfilment logic, or an internal form-and-table CRUD app, the
        market has products that do all of it, patched on somebody else&rsquo;s
        Tuesday. Custom software earns its cost when the logic is genuinely
        yours: pricing nobody else uses, a workflow that is the actual business,
        integrations no vendor supports.
      </p>
      <p>
        The test is quick and uncomfortable. Write down three things this
        application does that an off-the-shelf product could not. If you cannot
        fill all three lines, spend two weeks evaluating products before you
        spend a quarter on code. That advice costs us work and it is still
        right. The exception with a hard deadline is mobile: an app pinned to an
        SDK the stores no longer accept is a date on a calendar, which is why we
        treat store policy as part of the plan in{" "}
        <Link href="/services/mobile-app-development">
          mobile app development
        </Link>{" "}
        rather than as a launch afterthought.
      </p>

      <h2>What this assessment does not tell you</h2>
      <p>
        The five signals measure the artifact. They do not measure the knowledge
        that used to surround it, and that is the real limitation of running
        this as a one-day exercise.
      </p>
      <p>
        A codebase can score well on every signal and still be effectively
        unmaintainable, because the reasons behind its stranger decisions left
        with the people who made them. Why is that column never updated on a
        Friday? Which of two customer identifiers is authoritative? Code shows
        you what, never why, and a clean repository with no institutional memory
        can be a slower start than a messy one whose author still answers email.
        So buy time with the outgoing developer if any is available, even a few
        paid hours, and spend all of it on why questions. No static analysis
        substitutes for that call.
      </p>

      <h2>What a paid assessment looks like</h2>
      <p>
        Everything above is something you can run yourself, and if you have a
        competent engineer with a spare day, do. An outside pair of eyes earns a
        fee on the judgement calls: how bad the schema drift is, whether that
        vendored fork is survivable, what order to migrate in.
      </p>
      <p>
        The shape we already publish for work like this is a two-week readiness
        sprint, from $3,500 on our{" "}
        <Link href="/services/ai-consulting">consulting page</Link>. It is
        scoped around AI readiness rather than legacy assessment, but the
        engagement shape is the one this work wants: fixed length, fixed price,
        a written findings document you own outright, no obligation to continue
        with whoever wrote it. Ask for that shape, from us or anybody else. The
        deliverable is a document, not a proposal. The delivery that follows is
        ordinary{" "}
        <Link href="/services/web-development">web application engineering</Link>
        , and how we write up build decisions is visible in our{" "}
        <Link href="/work">published case studies</Link>.
      </p>

      <h3>If this is due diligence on an acquisition</h3>
      <p>
        Same five signals, different weighting. Schema stability and dependency
        drift matter most, because both become the buyer&rsquo;s liability on
        day one. Add a licence inventory, confirmation that intellectual
        property is actually assigned by every contractor who touched the
        repository, and the git history, which shows whether the delivery pace
        being claimed matches the commits. Ask for full history rather than a
        squashed snapshot. A seller unwilling to provide it has answered the
        question.
      </p>

      <h2>The compressed decision</h2>
      <p>
        Stabilise access and backups first. Run the five signals in a day and
        write the numbers down, because an unmeasured argument about a codebase
        is a preference contest. Refactor when the data model is sound, which it
        usually is. Rewrite only when you can state the constraint in one
        sentence. Otherwise do neither wholesale: put a router in front, move
        one low-risk route, keep the database shared, keep shipping. And if the
        thing turns out to be a product you could buy,{" "}
        <Link href="/contact">tell whoever quoted you a rebuild</Link> that you
        found a cheaper answer.
      </p>
    </ArticleLayout>
  );
}
