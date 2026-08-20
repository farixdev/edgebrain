"use client";

import Link from "next/link";
import { ArticleLayout } from "@/components/ui/article-layout";

/**
 * Body copy only.
 *
 * ArticleLayout owns the H1, breadcrumbs, byline, disclosure, prose styling,
 * "Keep reading" block and closing CTA, all read from the registry entry for
 * this slug. Nothing here re-types the title, and nothing here adds its own
 * Section or reveal wrapper: the layout already wraps the body in one
 * `data-reveal`/`initial={false}` motion.div, so the whole article is present
 * in the server HTML for crawlers.
 *
 * Number discipline, per the standing disclosure. The benchmark figures that
 * dominate this SERP ("53-56 FPS at ~30MB", "80-95% code shared", "40-60% less
 * effort") appear on a dozen unrelated domains with no device, no OS version
 * and no repository behind them. We are not laundering them by repeating them,
 * and we have not published a benchmark of our own, so this article ships the
 * measurement method instead of a number we cannot stand behind. Everything
 * else is either a checkable fact about a release, or is marked as our own
 * estimate.
 */
export function ReactNativeVsNativeContent() {
  return (
    <ArticleLayout slug="react-native-vs-native">
      <p>
        <strong>
          Default to React Native with Expo. Choose native Swift and Kotlin only
          if something in your next eighteen months of roadmap lands on a short
          list of capabilities where cross-platform genuinely runs out of road.
        </strong>{" "}
        For a normal product app &mdash; lists, forms, auth, payments, a feed, a
        map, push notifications &mdash; the performance argument has been over
        for a while, and as of React Native 0.82 the architecture everyone is
        still arguing about does not exist any more.
      </p>
      <p>
        The fear underneath this question is not frames per second. It is: will
        this cost me a rewrite in eighteen months? Apps almost never get
        rewritten because React Native was slow. They get rewritten because a
        roadmap item arrived that React Native could not reach &mdash; a Live
        Activity, a real-time vision pipeline, a watch app. So audit the roadmap
        against that list before you choose. The rest of this article is that
        list, the current architecture, and how to measure the difference
        yourself.
      </p>

      <h2>What React Native 0.82 changed, and why half of page one is wrong</h2>
      <p>
        Most of the articles ranking for this query still describe an
        asynchronous JSON bridge between JavaScript and native code, serialising
        every call and batching it across frames. That bridge is gone. Not
        deprecated &mdash; deleted.
      </p>
      <p>
        The timeline is short and worth knowing, because it dates any article
        you read. React Native 0.76 (October 2024) made the New Architecture the
        default. 0.80 (mid-2025) froze the legacy architecture and stopped
        taking fixes for it. 0.82 (October 2025) removed it, so there is no flag
        to turn it off and no fallback path. Expo has shipped New Architecture
        support across the <code>expo-*</code> packages since SDK 53, which is
        what made the removal survivable: the modules most apps depend on were
        ported before the old path disappeared.
      </p>
      <p>
        So if a comparison talks about &ldquo;enabling the new
        architecture&rdquo;, it was written against a version you can no longer
        install.
      </p>

      <h3>Fabric, and what synchronous layout is actually for</h3>
      <p>
        Fabric is the renderer, with a C++ core shared across iOS and Android
        &mdash; which is why the two platforms largely stopped disagreeing about
        flexbox edge cases. The consequential change is synchronous layout: a
        component can measure itself and act on that measurement in the same
        frame, instead of posting the question across a bridge and handling the
        answer two frames later. That kills a familiar class of bug. Tooltips
        that flash in the wrong position before snapping into place. Lists that
        jump when a cell measures itself after paint.
      </p>
      <p>
        What Fabric does not do is make the animation libraries redundant.
        Smooth gesture-driven animation was already solved before the New
        Architecture, by Reanimated worklets and Gesture Handler running
        animation code on the UI thread and never touching JavaScript
        mid-gesture. Fabric raised the floor; it did not move the ceiling.
      </p>

      <h3>TurboModules, and what happens at startup</h3>
      <p>
        Under the old model every native module registered at launch, whether or
        not the user ever opened the screen that used it. An app with forty
        native dependencies paid for forty of them on every cold start.
        TurboModules load lazily through JSI on first access, and Codegen
        generates typed C++ and platform glue from a TypeScript spec, so a
        mismatch that used to surface as a runtime crash on one platform now
        fails at build time on both. The startup win scales with how bloated
        your dependency list was, so a lean app will not notice it at all.
      </p>

      <h3>What the migration actually costs on a legacy app</h3>
      <p>
        Here is the part nobody quantifies, offered as an estimate rather than a
        measurement: <strong>your own code is rarely the bill</strong>. Screens,
        hooks, navigation and business logic mostly move untouched. The cost
        concentrates in native dependencies that never shipped Codegen specs,
        roughly in proportion to how many unmaintained native libraries sit in
        your <code>package.json</code>.
      </p>
      <p>
        Run that audit before scoping anything. For every dependency with a
        native module, check two things: the date of its last release, and
        whether it declares New Architecture support. Maintained ones cost a
        version bump. Ones abandoned in 2022 cost a replacement, a fork, or a
        hand-written native module &mdash; and two or three of those turn a week
        into a quarter.
      </p>

      <h2>React Native vs native performance: read the method, not the number</h2>
      <p>
        Search this question and the same figures come back across a dozen
        unrelated domains: a precise frame rate, a precise memory delta, a
        precise percentage of developers. None of them names a device, an OS
        version, or a repository. They are folklore with decimal points, copied
        between agency blogs for years without anyone re-running them.
      </p>
      <p>
        We are not adding to that pile by quoting a number we did not produce.
        The method is worth more to you anyway, because the answer depends on
        your app specifically, and you can get it in a day.
      </p>

      <h3>The comparison you can run yourself in a day</h3>
      <p>
        Build the same screen twice &mdash; once in React Native with Expo, once
        in SwiftUI or Jetpack Compose. Pick the screen that actually worries
        you, not a hello world. Usually that is a list of five hundred rows with
        images and variable heights, or whatever your app opens to.
      </p>
      <ul>
        <li>
          <strong>Test on the worst device you support</strong>, not the newest.
          A mid-range Android phone three or four years old is where
          cross-platform decisions are made or broken. A flagship tells you both
          approaches are fine, which is true and useless.
        </li>
        <li>
          <strong>Measure cold start to first interactive frame</strong> from a
          release build with Hermes bytecode. Debug builds run JavaScript
          through a much slower path, and most of the frightening numbers on the
          internet smell like debug builds.
        </li>
        <li>
          <strong>Measure dropped frames during a hard fling</strong>, not
          average FPS. Averages hide the stutter users notice. Instruments on
          iOS, Perfetto on Android.
        </li>
        <li>
          <strong>Measure resident memory after five minutes of use</strong>,
          not at launch, and take install size from an App Bundle with splits
          enabled &mdash; a universal APK overstates it badly.
        </li>
        <li>
          <strong>Record device model, OS version, build configuration and
          commit hash</strong> beside every number. A benchmark missing those
          four is an anecdote, including ours if we ever publish one.
        </li>
      </ul>
      <p>
        Our position, as engineering judgement rather than measurement: on
        list-and-form screens in a release build, the gap is small enough that
        users will not report it, and whatever delta exists shows up in cold
        start and install size rather than in scrolling. A felt gap does remain
        in per-frame custom rendering and in anything touching the camera
        pipeline &mdash; which is precisely the list below.
      </p>

      <h2>When not to use React Native: the rewrite-risk list</h2>
      <p>
        These are the capability classes where teams end up writing native code
        anyway. If two or more sit on your eighteen-month roadmap as core
        product rather than nice-to-have, the cross-platform saving is smaller
        than it looks.
      </p>

      <h3>High-refresh custom rendering</h3>
      <p>
        Bespoke per-frame drawing at 120Hz: a charting surface with pinch-zoom
        over tens of thousands of points, a drawing or design canvas, anything
        game-adjacent. React Native Skia and Reanimated get further here than
        most people expect, and often the answer is genuinely yes. When it does
        not hold, the debugging is harder than native and the ceiling is lower
        &mdash; and you find that out late.
      </p>

      <h3>Real-time camera, video and computer vision</h3>
      <p>
        Scanning a barcode or filtering a preview is fine; VisionCamera frame
        processors run on the native side and are a real tool. Trouble starts
        with manual capture control &mdash; ISO, focus, RAW, multi-camera,
        ProRes &mdash; per-frame ML inference at capture rate, custom video
        pipelines, or ARKit and ARCore. There you end up writing two native
        camera implementations and wrapping a React Native shell around them,
        which is the worst of both. Recognise it at the decision, not in month
        nine.
      </p>

      <h3>Deep OS integration</h3>
      <p>
        Home screen widgets, Live Activities and the Dynamic Island, App Intents
        and Siri, watchOS and Wear OS, CarPlay and Android Auto, keyboard
        extensions. Native by definition. Several can be bolted onto a React
        Native app as a separate native target sharing a data container, which
        is often the right compromise &mdash; but budget them as native work, on
        both platforms.
      </p>

      <h3>Background execution and media</h3>
      <p>
        Background audio with a lock screen player, resumable offline downloads,
        continuous location inside a battery budget, uploads that survive app
        termination. Libraries exist and several are good. But each OS handles
        background lifecycle differently and gets more aggressive about it every
        year, so the last stretch of correctness is platform work whichever
        library you started from.
      </p>

      <h3>Vendor SDKs that ship native only</h3>
      <p>
        Some payment terminals, DRM stacks, banking security SDKs and hardware
        integrations publish an iOS framework and an Android AAR and nothing
        else. Check before you commit, not during integration week. You can wrap
        a native-only SDK &mdash; but a wrapper you maintain for a vendor
        shipping breaking changes on their own schedule is a permanent tax.
      </p>

      <h2>Where the argument is over and React Native wins on cost</h2>
      <p>
        Marketplaces. Booking and scheduling. Delivery and logistics. Dashboards
        and SaaS companion apps. Internal tools. Commerce. Social feeds.
        Anything whose hard problems are state management, offline sync, auth
        and API design rather than pixels and sensors. For these, two native
        codebases buy a slightly better cold start and cost you a second team.
      </p>
      <p>
        The multiplier we use when scoping, marked as our estimate: two native
        codebases run roughly 1.6 to 1.9 times the client-side engineering
        effort of one React Native codebase for a feature-equivalent app. Not
        double, because design, backend, product and QA planning do not double
        &mdash; only client implementation does. Then it applies again to every
        feature afterwards, which is what gets under-weighted when the decision
        is made against a launch budget instead of a three-year one. If you are
        still sizing that budget,{" "}
        <Link href="/insights/mvp-development-cost">
          what building an MVP actually costs
        </Link>{" "}
        takes the same number apart across the whole build.
      </p>
      <p>
        There is also a team argument that beats the technology argument. If you
        have four iOS engineers who have written Swift for a decade and nobody
        who knows React, choosing React Native to save money is how you lose a
        year. The stack a team is genuinely good at wins most of these
        comparisons, this article included.
      </p>

      <h2>How much code you actually share</h2>
      <p>
        The commonly quoted eighty to ninety-five percent is not wrong so much
        as uninteresting. Line counts are dominated by screens and business
        logic, which do share almost completely. Engineering time distributes
        differently, and time is what you actually pay for.
      </p>
      <p>
        Platform-specific effort concentrates in a predictable set: permission
        flows and their rejection paths, push notification behaviour in each
        background state, deep links, in-app purchase edge cases, share sheets,
        the Android back button, and design conventions that should not be
        identical even where they can be. Our estimate: five to fifteen percent
        of engineering time goes there in a healthy shared app, and materially
        more if anything from the rewrite-risk list is in scope.
      </p>
      <p>
        The corollary matters for hiring. A React Native team that cannot read a
        stack trace in Xcode or open an <code>AndroidManifest.xml</code> will
        stall on exactly that five to fifteen percent, which is where
        release-blocking bugs live. When we scope{" "}
        <Link href="/services/mobile-app-development">
          cross-platform and native mobile development
        </Link>
        , native fluency is the thing being bought. The JavaScript is the easy
        half.
      </p>

      <h2>When you should not hire us, or build an app at all</h2>
      <p>
        A meaningful share of the apps people ask us to quote should not exist.
        If your app is a login, some content, a form and a list &mdash; no push
        notifications anyone would keep enabled, no offline requirement, no
        camera, no background behaviour &mdash; you are paying for two app store
        review processes to ship a website with a worse install funnel.
      </p>
      <p>
        Build{" "}
        <Link href="/services/web-development">
          a fast, properly responsive web application
        </Link>{" "}
        instead. You will ship sooner, fix bugs the same day rather than waiting
        on review, and find out whether anyone wants the product before paying
        for a mobile codebase. Come back when you have a reason that starts with
        a device capability or a retention mechanic, not with &ldquo;our
        competitor has one&rdquo;.
      </p>
      <p>
        A second case where the answer is to hire nobody: if what you need is a
        booking form, a small store, or an events listing with notifications,
        the template and no-code builders will do it for a monthly fee smaller
        than one week of any studio&rsquo;s rate. Custom development earns its
        keep when the app has real domain logic, offline state that has to
        reconcile, or an integration nothing off the shelf supports. Below that
        line, a subscription is the right answer. The broader version of the
        same decision &mdash;{" "}
        <Link href="/insights/in-house-vs-agency-vs-freelancer">
          hiring in-house versus an agency versus a freelancer
        </Link>{" "}
        &mdash; has the same shape.
      </p>

      <h2>Rewriting a React Native app in native, if it comes to that</h2>
      <p>
        The framing of &ldquo;a rewrite&rdquo; is the thing to attack. React
        Native apps can host native view controllers and activities, and native
        apps can host React Native screens &mdash; which is how large apps
        adopted React Native incrementally in the first place.
      </p>
      <p>
        So the realistic escape hatch is not rewriting an app, it is rewriting a
        screen. The camera flow becomes a native screen. The chart surface
        becomes a native view wrapped for React Native. The widget was always
        going to be native. Everything else stays shared, and you pay for the
        ten percent that needed it rather than the hundred percent that did not.
      </p>
      <p>
        A full rewrite is warranted in one situation, and we will name it
        plainly: the product has drifted so far into the rewrite-risk list that
        most new feature work is native anyway, and the React Native layer is
        overhead you maintain without using. That is a real end state for a real
        class of product, and it is visible eighteen months ahead if anyone is
        looking &mdash; which is why the roadmap audit is the entire job. If you
        want a second read on that list before committing,{" "}
        <Link href="/contact">send us the roadmap</Link> and we will tell you
        which items are the risky ones.
      </p>

      <h2>The compressed decision</h2>
      <p>
        Start with React Native and Expo. Ignore anything written about the
        bridge, because the New Architecture is now the only architecture. Audit
        your eighteen-month roadmap against the rewrite-risk list, and if two or
        more items are core product, price the native build before you decide.
        Hire for native fluency either way, because the platform-specific
        remainder is where releases get blocked. And measure on the worst device
        you support, in a release build, with the device and OS version written
        down beside the number &mdash; because every figure in this comparison
        that gets copied around the internet is missing exactly that.
      </p>
    </ArticleLayout>
  );
}
