"use client";

import Link from "next/link";
import { ArticleLayout } from "@/components/ui/article-layout";

/**
 * Body copy only.
 *
 * ArticleLayout owns the H1, breadcrumbs, byline, disclosure, prose styling,
 * "Keep reading" block and closing CTA — all read from the registry entry for
 * this slug. Nothing here re-types the title, and nothing here adds its own
 * Section or reveal wrapper: the layout already wraps the whole body in one
 * `data-reveal`/`initial={false}` motion.div, which is exactly the pattern this
 * article argues for and is why every word of it sits in the server HTML.
 *
 * Number discipline, per the standing disclosure the layout renders above this:
 * every figure is either attributed to a public source or labelled as our own
 * estimate. There is deliberately no conversion-lift statistic in this piece —
 * see "What actually justifies the spend" for why. Do not add one.
 */
export function WhyYourNextjsSiteIsSlowContent() {
  return (
    <ArticleLayout slug="why-your-nextjs-site-is-slow">
      <p>
        <strong>
          Three causes account for nearly every slow Next.js site, and none of
          them is the one the checklists lead with.
        </strong>{" "}
        LCP fails because of a network waterfall or a render-blocking decision,
        not an unoptimised image. INP fails because too much JavaScript hydrates
        on a route that never needed to be interactive &mdash; in the App
        Router, a <code>&quot;use client&quot;</code> boundary drawn one
        component too high. And whatever you fix gets quietly undone six weeks
        later by a third-party tag nobody reviewed.
      </p>
      <p>
        So the order matters more than the list. Find out which metric is failing
        and for whom, from field data at the 75th percentile. Fix the cause, not
        the symptom. Then put a budget in CI, because a one-off optimisation
        sprint has a half-life measured in deploys.
      </p>

      <h2>Find out what is actually failing before you touch anything</h2>
      <p>
        A Lighthouse run on your laptop measures your laptop: warm cache, fast
        CPU, one number with no percentile attached. Real users are a
        distribution, and Core Web Vitals are assessed against the slow end of
        it &mdash; all three thresholds at the 75th percentile of page loads
        over a rolling 28-day window: <a href="https://web.dev/articles/lcp">LCP</a> at
        or under 2.5 seconds, <a href="https://web.dev/articles/inp">INP</a> at
        or under 200 milliseconds, CLS at or under 0.1. Passing means the slowest
        quarter of your traffic is the only part still failing. Your median user
        was probably never the problem.
      </p>

      <h3>If the Chrome UX Report has nothing for you</h3>
      <p>
        <a href="https://developer.chrome.com/docs/crux">CrUX</a> only publishes
        data for origins and URLs with enough qualifying traffic, so small sites
        open the dashboard, see nothing, and conclude they are fine. No data is
        not the same condition as passing.
      </p>
      <p>
        Instrument your own with <code>useReportWebVitals</code> from{" "}
        <code>next/web-vitals</code>, in a small client component mounted in the
        root layout, and use the attribution build. Plain{" "}
        <code>web-vitals</code> says INP was 480 ms; attribution names the
        interaction target, the phase that burned the time, and the script that
        was running. One is a metric, the other is a lead.
      </p>
      <p>
        Segment by route and device class before concluding anything. A p75
        averaged across static marketing pages and a client-rendered dashboard
        describes neither, and the fix it points at is wrong for both.
      </p>

      <h2>Why a dashboard that was green in 2023 went red without a deploy</h2>
      <p>
        In March 2024, INP replaced FID as a Core Web Vital, and a lot of teams
        found a failing report on a codebase they had not touched. FID measured
        only the delay before the first event handler could begin running,
        ignoring how long it took and every interaction after it. INP measures
        the whole thing &mdash; input delay, processing duration, presentation
        delay &mdash; and reports close to the worst interaction of the visit.
      </p>
      <p>
        The gap between those rulers is enormous. Google&rsquo;s published field
        data around the switchover put origin-level FID pass rates near 97
        percent and INP pass rates near 65 percent. Nothing got slower. The ruler
        started counting the part that was always slow: your own JavaScript,
        after the click.
      </p>

      <h2>Next.js LCP optimization is a waterfall problem, not an image problem</h2>
      <p>
        Split LCP into its four sub-parts before optimising anything: time to
        first byte, resource load delay, resource load duration, element render
        delay. Google&rsquo;s budgeting guidance is roughly 40 percent TTFB, 10
        percent load delay, 40 percent load duration, 10 percent render delay.
        Each has a different fix, and three of the four have nothing to do with
        image compression.
      </p>

      <h3>Time to first byte</h3>
      <p>
        The most common Next.js cause is a route that went dynamic by accident.
        One call to <code>cookies()</code>, one uncached <code>fetch</code>, one
        header read inside a shared layout, and the whole segment opts out of
        static rendering. Read the route table <code>next build</code> prints and
        confirm the pages you believe are static actually are. The other cause is
        geography, which no framework fixes: streaming moves the shell earlier
        and helps perceived speed, not a 900 ms query.
      </p>

      <h3>Resource load delay, the sub-part everybody skips</h3>
      <p>
        The gap between the browser finishing the HTML and starting the LCP
        resource is where Next.js sites lose the most avoidable time. The image
        is fine; the browser heard about it too late. Three causes: the hero is a
        CSS background, invisible to the preload scanner; the hero sits inside a
        client component that must hydrate first; or lazy loading got applied
        globally by a lint rule. Put <code>priority</code> on the LCP image,
        never lazy-load it, and if you use <code>fill</code>, set{" "}
        <code>sizes</code> honestly &mdash; a missing <code>sizes</code> makes
        the browser assume full viewport width and fetch a much larger file than
        the slot displays.
      </p>

      <h3>Element render delay</h3>
      <p>
        If your LCP element is text rather than an image, which on a content site
        it usually is, image work is irrelevant and the question is what blocks
        paint: a font, a client-side fetch the text waits on, or an animation
        that starts the element at zero opacity.
      </p>
      <p>
        That last is close to universal on marketing sites and damages more than
        LCP: a reveal implemented as <code>opacity: 0</code> in the server HTML
        means the first paint carries no readable text. This site is a working
        counter-example. Its hidden states live in CSS behind a class the client
        adds after boot, so the server HTML carries visible copy. View source and
        check.
      </p>

      <h2>INP is usually a client boundary drawn one component too high</h2>
      <p>
        In the App Router, <code>&quot;use client&quot;</code> is not a label on a
        file. It is the top of a subtree: everything imported below it becomes
        client code, ships, and hydrates.
      </p>
      <p>
        The failure mode is mundane. Someone needs an <code>onClick</code> on one
        button, adds the directive at the top of the page file because that is
        where the state lives, and the whole route becomes a hydration payload.
        Server components versus client components stops being stylistic there.
        It is 40 KB versus 340 KB for the same visible page.
      </p>

      <h3>Find the frame, not the file</h3>
      <p>
        Two tools do the real work. The attribution build of{" "}
        <code>web-vitals</code> gives you the interaction target as a CSS
        selector plus the phase split. The Long Animation Frames API &mdash; a{" "}
        <code>PerformanceObserver</code> on <code>long-animation-frame</code>{" "}
        entries, in Chromium since Chrome 123 &mdash; names the scripts in a slow
        frame. The dominant phase decides the fix.
      </p>

      <table>
        <thead>
          <tr>
            <th>Dominant phase</th>
            <th>What it means</th>
            <th>Where to look</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Input delay</td>
            <td>The main thread was busy before your handler ran</td>
            <td>Hydration, or a third-party script</td>
          </tr>
          <tr>
            <td>Processing duration</td>
            <td>Your handler and the re-render it triggered</td>
            <td>State shape, context width, list size</td>
          </tr>
          <tr>
            <td>Presentation delay</td>
            <td>Layout and paint after the state change</td>
            <td>Large DOM, expensive CSS, unvirtualised lists</td>
          </tr>
        </tbody>
      </table>

      <h3>Move the boundary down, do not defer it sideways</h3>
      <p>
        The position most of this SERP will not take: reaching for{" "}
        <code>next/dynamic</code> first is the wrong instinct. Dynamically
        importing a component that should never have been a client component does
        not remove the cost, it reschedules it &mdash; usually to the moment the
        user scrolls, which is when they are trying to interact.
      </p>
      <p>
        Push the directive down to the leaf that needs it. Where a client
        component must wrap server-rendered content, pass that content in as{" "}
        <code>children</code> rather than importing it inside the client file:
        children handed down from a server parent stay on the server. That one
        pattern removes more client JavaScript than any bundler config we have
        ever changed.
      </p>

      <h3>When next/dynamic genuinely earns it</h3>
      <p>
        Three conditions at once: genuinely interactive, genuinely below the
        fold, genuinely heavy. A rich text editor, a charting library, a map.
        Deferring a 6 KB accordion is not a strategy, it is a commit message.
      </p>
      <p>
        Two caveats from the docs. <code>ssr: false</code> works only inside
        Client Components and removes that component from the server HTML
        entirely &mdash; correct for a map, wrong for anything a reader or
        crawler needs. And when a Server Component dynamically imports a Client
        Component, automatic code splitting is not currently applied, so the
        deferral you think you bought may not exist.
      </p>

      <h2>Reduce Next.js bundle size in the order that pays</h2>
      <p>
        Watch First Load JS per route in the <code>next build</code> table, not
        total bundle size. Users load routes, not applications. Each step below
        shrinks the next:
      </p>
      <ol>
        <li>
          <strong>Delete.</strong> Dead components, an abandoned experiment, a
          polyfill for a browser you stopped supporting.
        </li>
        <li>
          <strong>Move it to the server.</strong> Formatting, filtering, sorting,
          markdown rendering, date maths. No event, no browser state, no need to
          ship it.
        </li>
        <li>
          <strong>Swap the dependency.</strong> moment.js for date-fns; a full
          icon set down to the icons in use.
        </li>
        <li>
          <strong>Then split.</strong> <code>next/dynamic</code> for whatever
          survives the first three.
        </li>
      </ol>
      <p>
        Barrel files: one named import from a package re-exporting a thousand
        modules can pull far more than you asked for. Next.js applies{" "}
        <code>optimizePackageImports</code> to a default list including{" "}
        <code>lucide-react</code>, <code>date-fns</code> and <code>recharts</code>
        , but not your own <code>index.ts</code> barrels. Add them, run{" "}
        <code>@next/bundle-analyzer</code> before forming a theory, and accept
        the limit: shaving 30 KB off a route that already passes is a day spent
        on a number nobody experiences.
      </p>

      <h2>The single tag that undoes all of it</h2>
      <p>
        The claim we will defend against any checklist article on this subject:
        most Next.js performance work is eventually reversed by one third-party
        script added months later by someone who has never opened the repository.
        A campaign needs a pixel, support needs a chat widget, and neither goes
        through engineering.
      </p>
      <p>
        Tag managers are the sharpest version, because the container is a
        runtime. Its payload changes without a deploy, so your performance
        profile changes without a deploy, and CI never sees the change.
      </p>
      <p>
        Mechanically, <code>next/script</code> offers four strategies:{" "}
        <code>beforeInteractive</code> (root layout only, and almost nothing
        qualifies), <code>afterInteractive</code> (the default),{" "}
        <code>lazyOnload</code> (idle time), and the experimental{" "}
        <code>worker</code>. Widgets, analytics and pixels belong on{" "}
        <code>lazyOnload</code>. But the strategy prop is the small half of the
        fix. The large half is an allowlist, a CSP that enforces it, and a named
        approver.
      </p>

      <h2>The durable fix is a performance budget in CI</h2>
      <p>
        An optimisation sprint produces a graph that looks excellent for a
        quarter. A budget produces one that stays flat for years. Three checks,
        failing differently on purpose.
      </p>
      <ul>
        <li>
          <strong>Bundle size per route</strong>, asserted against the{" "}
          <code>next build</code> output or with <code>size-limit</code>.
          Deterministic, so it fails the build.
        </li>
        <li>
          <strong>Lab metrics</strong> via Lighthouse CI on a pinned runner,
          three or four representative routes. Noisy, so it comments on the pull
          request rather than blocking it.
        </li>
        <li>
          <strong>Field p75</strong> from your RUM, alerting weekly. The only
          check describing reality, and the slowest to react &mdash; which is why
          the other two exist.
        </li>
      </ul>
      <p>
        Set the threshold at today&rsquo;s number plus a small margin, not at
        your target. A budget set to an aspiration fails on day one, gets
        labelled flaky, and is switched off inside a month. Ratchet it down as
        improvements land.
      </p>

      <h2>What this approach costs, and when to hire nobody</h2>
      <p>
        The budget has a real failure mode, and we would rather name it than let
        you find it. A hard threshold blocks legitimate work. Someone lands a
        feature that genuinely needs a date picker, the check fails, and at six
        on a Thursday the cheapest path is to raise the number by 20 KB and
        merge. Do that four times and the budget is a comment. The only defence
        we know is procedural &mdash; raising the threshold takes a second
        reviewer and a reason in the commit &mdash; which is a social control,
        not a technical one.
      </p>
      <p>
        There is also a category of reader who should hire nobody. If your
        Next.js site is a few dozen static marketing pages and your LCP is four
        seconds, the cause is almost certainly images skipping the optimiser, a
        hosting region wrong for your audience, or an analytics stack on{" "}
        <code>beforeInteractive</code>. All three show up in a free PageSpeed
        Insights report and are an afternoon of work for whoever built the site.
        Our minimum engagement is $2,500. An afternoon should not cost that.
      </p>
      <p>
        Same answer when the bottleneck is not the framework. A 900 ms query
        behind every render, an n+1 in a server component, an upstream API with
        no cache &mdash; hydration discipline touches none of those, and a
        proposal promising Core Web Vitals gains without opening the data layer
        is selling you the visible half of the problem. Sorting out which half
        you have is most of what scoping a{" "}
        <Link href="/services/web-development">
          web application build or rebuild
        </Link>{" "}
        is for.
      </p>

      <h2>What actually justifies the spend</h2>
      <p>
        You will find a great many posts quoting a conversion lift per 100
        milliseconds. Almost all trace back to a handful of retail studies, run
        on sites nothing like yours, when the web looked different. We are not
        relaying those as though they predict your funnel. Two mechanics do the
        arguing instead, and both are checkable in your own analytics.
      </p>
      <p>
        <strong>Abandonment is mechanical.</strong> LCP is the moment the page
        becomes useful. Every millisecond before it is one in which someone can
        leave, and when they do it lands in your reporting as a bounce rate
        problem rather than a performance problem. That misattribution is why
        slow sites stay slow.
      </p>
      <p>
        <strong>Crawl efficiency is arithmetic.</strong> A crawler spends a
        budget of requests per visit. Slower responses mean fewer URLs fetched,
        so new pages are found later. On a site with thousands of URLs that
        genuinely constrains how fast content earns anything. On a twenty-page
        site it is irrelevant, and anyone saying otherwise is padding a proposal.
      </p>
      <p>
        A third, quieter argument: content that exists only after hydration is at
        the mercy of a rendering queue you do not control. Server-rendered text
        is not. That is why this site ships no <code>opacity: 0</code> in its
        server HTML, and the same reasoning drives how we approach a{" "}
        <Link href="/services/wordpress-to-nextjs-migration">
          WordPress to Next.js migration
        </Link>{" "}
        &mdash; the rendering model is the deliverable, not the redesign. The
        build notes on our <Link href="/work">work page</Link> record the same
        decisions.
      </p>

      <h2>The compressed version</h2>
      <ol>
        <li>
          Get field data at p75, per route. If CrUX is empty, instrument with{" "}
          <code>useReportWebVitals</code> and the attribution build.
        </li>
        <li>
          Split LCP into its four sub-parts first. TTFB and resource load delay
          are usually the guilty pair.
        </li>
        <li>
          For INP, find the client boundary drawn one component too high and move
          it down. Reach for <code>next/dynamic</code> fourth, not first.
        </li>
        <li>
          Cut bundle size by deleting, then moving work to the server, then
          swapping dependencies, then splitting.
        </li>
        <li>Audit the third-party scripts, then govern them.</li>
        <li>
          Put a budget in CI the same week, at today&rsquo;s number, with a named
          owner and a rule about raising it.
        </li>
      </ol>
      <p>
        If you want it run as scoped work, the shape of the engagement matters
        more than the day rate &mdash; see{" "}
        <Link href="/insights/fixed-price-vs-time-and-materials">
          fixed price versus time and materials
        </Link>{" "}
        and{" "}
        <Link href="/insights/mvp-development-cost">
          what actually moves a build estimate
        </Link>
        . Or send the URL and the failing metric, and we will name which of the
        six applies &mdash; a{" "}
        <Link href="/contact">two-paragraph email</Link>, not a proposal.
      </p>
    </ArticleLayout>
  );
}
