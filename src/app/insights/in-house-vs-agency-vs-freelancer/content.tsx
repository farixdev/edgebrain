"use client";

import Link from "next/link";
import { ArticleLayout } from "@/components/ui/article-layout";

/**
 * Body copy only. Every piece of chrome — H1, breadcrumbs, byline, disclosure,
 * "keep reading", closing CTA — belongs to ArticleLayout, and the prose
 * stylesheet lives there too. This file writes plain semantic HTML and nothing
 * else, which is also why it carries no `data-reveal` of its own: the layout
 * reveals the whole body as one block, so nothing here ships hidden.
 */
export function InHouseVsAgencyVsFreelancerContent() {
  return (
    <ArticleLayout slug="in-house-vs-agency-vs-freelancer">
      <p>
        Three thresholds decide this, and none of them is an hourly rate. Under
        roughly six weeks of engineering work, hire a freelancer or a specialist
        contractor — an agency&rsquo;s fixed scoping and onboarding cost eats the
        difference before anyone writes code. Between six weeks and about nine
        months, on a project with a defined endpoint that is not your core
        product, an agency is usually the cheapest route to a working system. If
        the software is the company — the thing customers pay for, still changing
        in three years — hire in-house, and start the search now even if an
        agency bridges the first quarter.
      </p>
      <p>
        Below is the arithmetic behind them, itemised so you can replace the
        assumptions that are wrong for your market.
      </p>

      <h2>Compare cost per delivered engineering week, not hourly rate</h2>
      <p>
        Rates are not comparable across these models, because they cover
        different amounts of work. A salary buys calendar time, not delivery
        time. An agency rate folds in project management, code review, QA and
        release plumbing. A freelance rate has none of those, and somebody on
        your side does them unpaid. So normalise to one unit:{" "}
        <strong>
          what does a week of shipped engineering cost, and when does the first
          one arrive
        </strong>
        . Two inputs produce it — the total cost of ownership of the team, and
        the share of paid capacity that converts into delivered work. The second
        is where the models diverge, and it is the one every comparison table
        omits. Every figure below is our own estimate from practice, not a
        published survey.
      </p>

      <h3>The in-house column, itemised</h3>
      <p>
        One senior full-stack engineer in the United States, measured across
        twelve months from the day you decide to hire rather than from their
        start date. That distinction is most of the answer.
      </p>
      <table>
        <thead>
          <tr>
            <th>Year-one line item</th>
            <th>Estimate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base salary</td>
            <td>$145,000</td>
          </tr>
          <tr>
            <td>
              Employer burden — payroll taxes, health premium, retirement match,
              statutory insurance, laptop, per-seat software
            </td>
            <td>$38,000</td>
          </tr>
          <tr>
            <td>Recruiting — contingency fee at 20% of first-year base</td>
            <td>$29,000</td>
          </tr>
          <tr>
            <td>Ramp — six weeks at roughly half output</td>
            <td>$10,500</td>
          </tr>
          <tr>
            <td>Management — four hours a week of a lead at $100/hr</td>
            <td>$20,000</td>
          </tr>
          <tr>
            <td>
              <strong>Total, year one</strong>
            </td>
            <td>
              <strong>≈ $242,000</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Recruiting is not avoided by doing it yourself; it converts into 60 to
        100 hours of your team&rsquo;s time, which is not free, only invisible.
        Now the denominator. Six to twelve weeks from job description to signed
        offer, plus a two to eight week notice period — call it fourteen weeks
        before day one, leaving about 38 employed weeks in that first year. A
        solo engineer with no team around them converts roughly 55 to 70 percent
        of their hours into feature work; the rest is meetings, dependency
        upgrades, incidents, and waiting on decisions only you can make.
      </p>
      <p>
        Thirty-eight weeks at 62 percent is about 23.5 delivered engineering
        weeks for $242,000 — roughly{" "}
        <strong>$10,300 per delivered week in year one</strong>, the first
        landing in month four. Year two inverts it: no recruiting, no ramp, less
        management, about $183,000 for roughly 27 delivered weeks, or{" "}
        <strong>$6,800 per delivered week</strong> — from someone who now knows
        your domain. In-house is expensive to start and cheap to continue. That
        shape is the whole decision.
      </p>

      <h3>The agency column, and where our own bias sits</h3>
      <p>
        Agency rates split by geography far more than by quality. What one
        full-time-equivalent costs per delivered week at 40 billed hours:
      </p>
      <table>
        <thead>
          <tr>
            <th>Band</th>
            <th>Rate</th>
            <th>Per delivered week</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Onshore — US, UK, Western Europe</td>
            <td>$120–$220/hr</td>
            <td>≈ $7,800 at $160</td>
          </tr>
          <tr>
            <td>Nearshore — Latin America, Poland, Romania, Portugal</td>
            <td>$55–$100/hr</td>
            <td>≈ $3,650 at $75</td>
          </tr>
          <tr>
            <td>Offshore — South Asia, South East Asia</td>
            <td>$30–$65/hr</td>
            <td>≈ $2,200 at $45</td>
          </tr>
        </tbody>
      </table>
      <p>
        We are in that third band, in Lahore, so read every number above knowing
        the comparison flatters us. The rate is also not the interesting part.
        Conversion is. A functioning agency bills 35 to 40 hours a week per
        allocated person and turns 80 to 85 percent of it into your work, because
        management, review, QA and release sit inside the rate rather than being
        borrowed from your calendar. That gap is what you are buying.
      </p>
      <p>
        Against it, every agency carries a fixed cost per engagement: discovery,
        scoping, environment setup, learning your domain, contracting, handover.
        Twenty-five to fifty hours regardless of project size. On a 1,200-hour
        build that is two to four percent. On a 240-hour build it is ten to
        twenty — which is where the first threshold comes from. For the same
        arithmetic on a specific brief, we took it apart in{" "}
        <Link href="/insights/mvp-development-cost">
          what building an MVP actually costs
        </Link>
        .
      </p>

      <h2>Why an agency is the wrong answer under six weeks</h2>
      <p>
        Six weeks is roughly 240 engineering hours. Below that line an
        agency&rsquo;s fixed overhead is a large enough share of the project to
        erase whatever their process was going to buy you. You fund a ramp on a
        job that finishes before the ramp does. It is worse on their side, which
        is useful information: sales and contracting are fixed per engagement, so
        a shop that takes a two-week job eagerly either has a bench sitting idle
        or will staff it with whoever is between projects.
      </p>
      <p>
        Hire a specialist contractor instead — someone who has done that exact
        thing before. A Stripe billing integration, a Shopify app, a migration
        off a specific framework version. Expect $80 to $150 an hour and pay it
        without flinching: you buy far fewer hours and no ramp, because their
        whole value is having already made every mistake this job has on offer.
      </p>
      <p>
        The honest exception: work that is small but lives inside a system nobody
        can safely touch — a payments flow, an auth boundary, anything where one
        bad week costs you customers. There, buy the process rather than the
        hours.
      </p>

      <h2>
        A freelancer&rsquo;s rate is low because you took the project management
        job
      </h2>
      <p>
        This is the transfer nobody prices, and it stays invisible until it
        fails. A solo freelancer at $80 an hour delivering 30 productive hours
        a week invoices $2,400. To keep those hours productive, somebody on your
        side writes the specs, answers ambiguous questions inside a day, reviews
        the pull requests, tests each increment and decides what happens next.
        Four to eight hours a week. Price your own time at $100 an hour and the
        real cost is $2,800 to $3,200 — an effective rate of $93 to $107, paid
        partly in the only currency you cannot buy more of.
      </p>
      <p>
        Often that is still the right trade; early on a founder should be close
        to the product anyway. It stops being right at two points. The first is
        when you stop having the hours: the week you are raising, hiring or
        closing a large customer is the week the specs get thin — and thin specs
        are how a freelance engagement becomes three months of the wrong thing,
        discovered at the demo.
      </p>
      <p>
        The second is scale, and it is not linear. Nobody is paid to make two
        freelancers&rsquo; work fit together, so the integration is yours and it
        arrives as a surprise. Three people on one codebase with no technical
        lead produces three architectures. If your instinct is to add a second
        freelancer to go faster, you have crossed into needing a team — which is
        what an agency or an in-house lead sells.
      </p>

      <h2>Bus factor of one, and how to actually close it</h2>
      <p>
        The freelancer risk is not that the person disappears. Most do not. The
        risk is that the knowledge disappears with them, because it was never
        written down anywhere else. What goes missing, roughly in order: the
        deploy step that exists only in someone&rsquo;s shell history;
        credentials in a personal password manager; the Vercel or Supabase
        project on a personal account; the domain registered to their email; the
        undocumented environment variable the app will not boot without. Close it
        with conditions in the engagement, not with trust.
      </p>
      <ul>
        <li>
          Every repository in your GitHub organisation from the first commit. Not
          transferred at the end — transfers at the end do not happen.
        </li>
        <li>
          Every cloud, DNS and third-party account under your billing identity,
          contractor invited as a member. Test it by revoking their access for an
          hour.
        </li>
        <li>
          Deployment in CI. If shipping needs a specific human running a command
          on a specific laptop, you do not own the software yet.
        </li>
        <li>
          A README that takes a stranger from clone to a running local
          environment in under thirty minutes — verified by having someone else
          follow it, not by reading it and nodding.
        </li>
      </ul>
      <p>
        The cheapest test of all: ask them to take a week off in month two. If
        nothing can move while they are away, you have a bus factor problem now.
        You simply have not been billed for it yet.
      </p>

      <h2>The agency failure mode: staffed with whoever is free</h2>
      <p>
        The senior engineer from the pitch deck who appears on the kickoff call
        and is never seen again is a real pattern, and a preventable one. It
        happens structurally rather than dishonestly: agencies optimise for
        utilisation, and a shop above 85 percent billable has no slack, so when
        their largest account expands the slack comes from the smallest, newest
        client on the roster. That is you. Four questions before signing tell you
        more than any portfolio does.
      </p>
      <ul>
        <li>
          Which named individuals are on this, and what percentage of their week?
          Put names and allocation in the statement of work, with a right to
          refuse substitutions.
        </li>
        <li>
          What is your target utilisation? Above 85 percent means no slack, and
          your project is where slack gets taken from.
        </li>
        <li>
          Can we see the commit history of a finished project? Not screenshots.
          History shows review culture, test discipline, and whether one person
          wrote everything.
        </li>
        <li>
          What does handover contain? A shop that cannot show you a real one has
          never written one.
        </li>
      </ul>
      <p>
        Across time zones these failure modes compound, which we wrote up in{" "}
        <Link href="/insights/working-with-offshore-development-team">
          how to work with an offshore development team
        </Link>
        , from the offshore side of the table. The three case studies on{" "}
        <Link href="/work">our work page</Link> are labelled for what they are —
        two of them reference builds, not client engagements. Demand that
        specificity from anyone.
      </p>

      <h2>Staff augmentation is a fourth column, and it fails in one way</h2>
      <p>
        Staff augmentation rents you individual engineers who work inside your
        process: your sprint, your code review, your standup. An agency rents you
        a team and a process. Different products, similar rates, endlessly
        conflated.
      </p>
      <p>
        It works when you have engineering leadership and a functioning process
        and are short only on throughput. Two experienced engineers dropped into
        a team with a strong tech lead is the fastest legitimate way to add
        capacity, and cheaper than an agency because you are not paying twice for
        management you already employ.
      </p>
      <p>
        It fails when there is no lead. Without someone in-house owning
        architecture, review and priorities, staff augmentation is a freelancer
        with an agency markup and none of the agency&rsquo;s project management —
        the worst of the four columns. If your honest answer to &ldquo;who runs
        these people&rdquo; is &ldquo;I will, somehow&rdquo;, buy the team or hire
        the lead first.
      </p>

      <h2>When you should hire nobody at all</h2>
      <p>
        These cost us work. They are still true, and a studio unwilling to say
        them is one to read more carefully.
      </p>
      <p>
        An internal dashboard for fewer than about twenty users — CRUD over your
        own database, some filters, a couple of charts — should be Retool,
        Budibase, or an Airtable and Softr pair. A bespoke admin panel is three
        to five weeks of agency time and you inherit its maintenance forever. The
        tool costs a few hundred a year and someone non-technical can add a
        column without filing a ticket.
      </p>
      <p>
        A marketing site under ten pages with no application behind it should be
        Framer or Webflow, and the budget should go to a designer rather than an
        engineer. Custom starts paying when you need programmatic pages at scale,
        real internationalisation, or an application boundary the CMS cannot
        cross — the point where{" "}
        <Link href="/services/web-development">
          custom Next.js web development
        </Link>{" "}
        begins to make sense, and genuinely not before.
      </p>
      <p>
        A workflow of under ten steps touching only SaaS products with existing
        connectors should be Zapier, Make, or self-hosted n8n. A custom{" "}
        <Link href="/services/ai-automation">AI automation build</Link> earns its
        cost when volume, error handling, or an accuracy requirement breaks what
        a connector can express — not merely because a manual process exists.
      </p>
      <p>
        And do not build authentication, payments or search. Clerk, WorkOS,
        Stripe, Typesense, Algolia. Every hour reimplementing those rebuilds
        something maintained by a security team larger than your company.
      </p>
      <p>
        The rule underneath all four: build custom when the off-the-shelf
        tool&rsquo;s data model fights your domain, when your volume breaks its
        pricing curve, or when the thing is the surface you compete on. Otherwise
        rent it, and spend the engineering where it differentiates you.
      </p>

      <h2>The thresholds, stated plainly</h2>
      <ul>
        <li>
          <strong>Under six weeks.</strong> Specialist contractor, or an
          off-the-shelf tool.
        </li>
        <li>
          <strong>Six weeks to nine months, defined endpoint, not core.</strong>{" "}
          Agency — the band where buying a process beats assembling one.
        </li>
        <li>
          <strong>Ongoing, and the software is the company.</strong> In-house.
          Year one costs more per delivered week than any agency; year three
          buys domain knowledge nobody can sell you.
        </li>
        <li>
          <strong>Tech lead in place, short on throughput.</strong> Staff
          augmentation.
        </li>
        <li>
          <strong>No tech lead, and you cannot evaluate engineers.</strong> The
          real blocker, and no delivery model fixes it. Pay a technical advisor
          for the interview loop, or run an agency engagement and hire your first
          engineer out of the people who have already read your codebase.
        </li>
      </ul>

      <h2>Where we would rule ourselves out</h2>
      <p>
        We are an agency in Lahore working with clients worldwide, which puts us
        in the offshore rate band and arranges every number above in our favour.
        Three cases where we would tell you to go elsewhere.
      </p>
      <p>
        Anything under about three weeks. Our sales and scoping cost more than
        the value we would add. Hire the specialist contractor.
      </p>
      <p>
        Anything where you already have a strong in-house team and a working
        process. You want staff augmentation or a direct hire, not a second
        delivery process running alongside the one you trust.
      </p>
      <p>
        Anything needing daily live collaboration with a US West Coast team.
        Pakistan Standard Time is twelve hours ahead of Pacific, which leaves one
        overlap window and demands real asynchronous discipline: written
        decisions, recorded demos, specs that survive without a call. We are good
        at that, and it is still a cost. If your team pairs live every day,
        nearshore beats us — better said now than found out in week three.
      </p>
      <p>
        When the work genuinely is yours long-term, we build it properly and tell
        you to hire in parallel, so the handover goes to a person rather than a
        repository. <Link href="/contact">Send us the scope and the deadline</Link>{" "}
        and we will name the column it belongs in — including the ones we do not
        sell.
      </p>
    </ArticleLayout>
  );
}
