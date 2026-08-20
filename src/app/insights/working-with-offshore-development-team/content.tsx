"use client";

import Link from "next/link";
import { ArticleLayout } from "@/components/ui/article-layout";

export function WorkingWithOffshoreDevelopmentTeamContent() {
  return (
    <ArticleLayout slug="working-with-offshore-development-team">
      <p>
        We are an offshore development team. EdgeBrain Studios is in Lahore, most
        of our clients are not, and on somebody&rsquo;s org chart we are the box
        marked &ldquo;vendor, UTC+5.&rdquo; Read this the way you would read a
        bank explaining overdraft fees.
      </p>
      <p>
        The answer first. Offshore engagements are decided in the first two
        weeks, by four things that belong in writing before anyone commits code:
        a named overlap window against your working hours, a written end-of-day
        handoff, milestone payments tied to acceptance criteria you drafted, and
        your ownership of the repository, the CI account and every credential
        from the first commit rather than at the end. Time zones are not the
        failure mode. Handover is. Everything below is how to hold a vendor to
        those four things &mdash; including how to hold us to them.
      </p>

      <h2>Why an offshore team says yes to everything</h2>
      <p>
        Because saying no is expensive and saying yes is free until month three.
        A studio competing in a market where deals are won on price and
        agreeableness has a direct financial incentive to accept your timeline,
        your architecture and your scope creep without argument. The cost of that
        yes lands on a developer at 11pm, not on the person who said it.
      </p>
      <p>
        So a vendor who never pushes back is telling you something, and it is not
        that your brief was excellent. In a real scoping conversation we expect
        to disagree two or three times: a feature that should be cut, a deadline
        that is arithmetic rather than ambition, an integration whose sandbox is
        going to eat a week. If none of that happened in your sales calls, the
        disagreements still exist. They have been deferred to a point where they
        cost money.
      </p>
      <p>
        A cheap test during evaluation: put one genuinely bad idea in the brief
        &mdash; a real-time requirement that does not need to be real time, an
        admin panel you would obviously buy. See who flags it.
      </p>

      <h2>What &ldquo;senior&rdquo; means at different rate points</h2>
      <p>
        &ldquo;Senior developer&rdquo; is not a protected term anywhere. It is a
        line item on a rate card, and what sits behind it moves with the price.
        The bands below are our own read of the 2026 market, not a published
        survey.
      </p>
      <table>
        <thead>
          <tr>
            <th>Blended hourly rate</th>
            <th>What &ldquo;senior&rdquo; usually means at that price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$15&ndash;$28</td>
            <td>
              Three to five years, one stack, rarely any production on-call
              experience. Capable of building what you describe; generally not
              of telling you it is the wrong thing to build.
            </td>
          </tr>
          <tr>
            <td>$28&ndash;$55</td>
            <td>
              Five to nine years, has run something in production and been paged
              for it. Will argue about the data model. Where most South Asian
              and Eastern European studios sell their real seniors, and where we
              sit.
            </td>
          </tr>
          <tr>
            <td>$55&ndash;$95</td>
            <td>Nearshore and boutique onshore. Comparable engineering, far better overlap.</td>
          </tr>
          <tr>
            <td>$95&ndash;$200</td>
            <td>Onshore agency. You are buying accountability, contractual recourse, and someone who will sit in a room.</td>
          </tr>
        </tbody>
      </table>
      <p>
        The useful question is not the rate but the delta between what you are
        charged and what the person writing the code is paid. At $22 an hour in a
        market where good engineers clear $2,500 a month, the arithmetic only
        closes if that developer is junior, split across three accounts, or both.
        Nobody will tell you which. You infer it from the first two weeks of
        commits.
      </p>

      <h2>The interviewer is usually not the implementer</h2>
      <p>
        This is the most common offshore development red flag and the hardest to
        catch, because nothing dishonest is said. You interview a strong
        engineer. They are strong. They are also the studio&rsquo;s best
        interviewer, with a calendar full of interviews rather than tickets. What
        gets assigned is a team that person supervises &mdash; sometimes closely,
        sometimes as a name on a Slack channel.
      </p>
      <p>
        The countermeasures are boring and they work. Name the individuals in the
        statement of work with their allocation as a percentage. Require written
        notice before any substitution, and a replacement of equal seniority.
        Then verify by reading commits: everyone named in the SOW should appear
        in the git history in week one, authoring code rather than merging it. A
        named lead whose only commits are merge commits is supervising, not
        building, and you are paying for building.
      </p>
      <p>
        Ask how many concurrent projects each named person is on. The honest
        answer is rarely one, and a vendor claiming perfect exclusivity across a
        bench of twelve is either very idle or rounding.
      </p>

      <h2>Questions to ask an offshore development partner</h2>
      <p>
        Skip the ones with obvious right answers. These have none, which is why
        they produce information.
      </p>
      <ul>
        <li>
          <strong>What did you last tell a client not to build?</strong> A studio
          with no such story has no opinions or no memory.
        </li>
        <li>
          <strong>What happens to my team if you sign a client three times my
          size next month?</strong> Someone gets moved. Ask who decides and what
          notice you get; written allocation is the only real protection.
        </li>
        <li>
          <strong>Show me a pull request from last week &mdash; any project,
          redact freely.</strong> You are reading description quality, size, and
          whether a second human left a substantive review comment.
        </li>
        <li>
          <strong>What is your on-call arrangement in my time zone after
          launch?</strong> &ldquo;We are always available&rdquo; means there is
          no arrangement.
        </li>
        <li>
          <strong>What do you charge for the first two weeks if I stop
          there?</strong> A paid pilot that produces working code is the cheapest
          vetting available. Resistance to it is informative.
        </li>
      </ul>

      <h2>Offshore development team time zone overlap: how many hours you need</h2>
      <p>
        Three hours of guaranteed overlap, four if the vendor has to integrate
        with an in-house team. Below two you are running a relay race with a
        one-day baton. Above five you are paying for a night shift, and night
        shifts retain people badly &mdash; which becomes your problem when the
        one person who understood your billing logic leaves.
      </p>
      <p>
        Concretely, from Lahore at UTC+5: London is four hours behind, so 1pm to
        6pm here is 9am to 2pm there and overlap is nearly free. New York is nine
        or ten hours behind depending on daylight saving, so our 5pm to 8pm is
        their 8am to 11am &mdash; three hours, bought with a late finish on one
        side. San Francisco is twelve hours out and no arrangement is comfortable
        for both parties; someone works unsociable hours, and you should know
        which side and pay for it.
      </p>
      <p>
        Put the window in the contract as a clause, not a Slack message.
        Something like: <em>the supplier guarantees at least three hours of
        overlap with 09:00&ndash;17:00 Eastern on business days, and responds to
        messages within that window inside 60 minutes.</em> Vendors who intend to
        honour it will sign it. That is the point of the clause.
      </p>

      <h3>An end-of-day handoff that takes six minutes to write</h3>
      <p>
        The highest-leverage ritual in offshore work, and the one most teams skip
        because it feels like paperwork. It is not a status report, it is a
        baton. One message, same channel, same time daily:
      </p>
      <pre>
        <code>{`**Shipped** — what merged today, with PR links.
**In flight** — what is half-built, and where the branch is.
**Blocked** — what needs a decision, WHO needs to make it,
  and what we will do by default if nobody answers.
**Tomorrow** — the two or three things starting next.
**Surprises** — anything discovered that changes an estimate.`}</code>
      </pre>
      <p>
        The default in the blocked line is what makes it work. &ldquo;Blocked on
        empty-state copy; if we hear nothing by 11am we ship the placeholder and
        move on&rdquo; converts a dead day into a reversible decision. Without
        it, a team stops for eighteen hours and calls it waiting on the client.
      </p>

      <h2>Pull request size and review cadence as a weekly quality signal</h2>
      <p>
        You do not need to read the code to know whether the engineering is
        healthy, only the shape of the pull requests &mdash; ten minutes a week
        in the GitHub or GitLab insights tab. The thresholds we hold ourselves to
        and would expect from any vendor:
        most PRs under 400 changed lines, because review effectiveness collapses
        past a few hundred and everyone beyond that is approving on vibes. First
        review comment inside one working day. Something merged to the main
        branch every day or two per developer. Reviews containing sentences
        rather than a thumbs-up.
      </p>
      <p>
        The pattern to be afraid of is a fortnight of silence followed by a
        4,000-line pull request titled &ldquo;feature complete.&rdquo; That is
        not productivity, it is unreviewed work, and its defects are already
        priced into your timeline whether anyone has found them yet or not.
      </p>

      <h2>Milestone-based payment, and what resistance to it means</h2>
      <p>
        Structure it so no single unpaid milestone exceeds three weeks of work or
        roughly 15 percent of contract value, each released against acceptance
        criteria you wrote and can test yourself. Hold ten to fifteen percent
        until final acceptance. That caps your exposure at one milestone if the
        engagement fails, which is the only number that matters when it does.
      </p>
      <p>
        Vendors resist for two reasons, not equally legitimate. Cash flow is
        legitimate: a studio meeting payroll in a currency it does not bill in
        needs a deposit, and 30 to 40 percent up front on a short fixed-scope
        build is normal &mdash; our own default is exactly that. Resistance to{" "}
        <em>acceptance criteria</em> is not. A vendor arguing that milestones
        cannot be defined for creative work is arguing that you should not be
        able to tell whether they delivered. Milestones constrain the vendor,
        which is their function. For how a fixed-price number gets built, we
        took{" "}
        <Link href="/insights/mvp-development-cost">
          an MVP quote apart line by line
        </Link>{" "}
        in a separate piece.
      </p>

      <h2>Own the repository, the CI and the credentials on day one</h2>
      <p>
        Not at handover. On day one, before the first commit. The GitHub
        organisation is yours and the vendor is invited into it. Cloud accounts
        sit under your billing with the vendor holding scoped IAM roles. DNS is
        in your registrar. Every third-party API key is created by you and shared
        through a vault the vendor can be removed from in one click. CI runs in
        your account.
      </p>
      <p>
        The reason is not distrust, it is leverage symmetry. A vendor holding
        your infrastructure has an argument during a dispute that a vendor
        holding only an invoice does not. Removing it protects both sides: the
        only thing either party can escalate with is the quality of the work. A
        five-minute conversation at kickoff, an unwinnable one at month four.
      </p>
      <p>
        Add a documented restore: a README that lets a new developer run the
        project from a clean machine, verified by someone who did not write it.
        Without it the knowledge sits in one head in another country, which is
        the real offshore risk. We treat that as part of{" "}
        <Link href="/services/web-development">
          how a web build gets handed over
        </Link>{" "}
        rather than a closing task.
      </p>

      <h2>What to do when an offshore development team is not delivering</h2>
      <p>
        First, separate silence from slippage. Slippage is a schedule problem and
        usually recoverable. Silence &mdash; missed standups, handoffs that stop
        arriving, questions answered in three words at midnight &mdash; is a
        relationship problem and worsens on its own.
      </p>
      <p>
        The sequence, in order. Have an independent engineer read the last five
        merged pull requests; two hours of that costs a fraction of the milestone
        you are about to release. Put the specific gap in writing to the account
        lead with dates attached, not feelings. Hold the current milestone
        payment, having said in advance that you would. Ask for a two-week
        recovery plan with named people and dated deliverables.
      </p>
      <p>
        If the recovery plan slips too, stop. The second half of a failing
        engagement costs more than the first, because you are paying someone to
        understand code they no longer remember writing. Exercise the exit
        clause, take the repository you already own, and pay for a proper
        handover week. The vendors who make that expensive are the ones holding
        your infrastructure.
      </p>

      <h2>When offshore is the wrong answer, including with us</h2>
      <p>
        The part a vendor is supposed to leave out. Three cases where we would
        tell you not to hire an offshore studio, ours included.
      </p>
      <p>
        <strong>Your requirements are genuinely unknown.</strong> If the product
        is still being discovered week to week, every round trip is multiplied by
        the time-zone gap, and a nearshore team at $60 an hour with seven hours
        of overlap will out-deliver an offshore team at $35 with three. Offshore
        versus nearshore is not a rate comparison, it is a comparison of how many
        decisions per day your project needs. High decision density, go nearshore.
        Well-specified scope, offshore wins clearly.
      </p>
      <p>
        <strong>The work is regulated and jurisdiction is the deliverable.</strong>{" "}
        Some healthcare, defence and financial contracts require data residency
        or in-country personnel. That is a legal constraint, not a preference,
        and no amount of engineering quality resolves it.
      </p>
      <p>
        <strong>The thing you want already exists as a product.</strong> A large
        share of the briefs we receive describe something Shopify, Webflow,
        Airtable or Retool already does for $50 a month. We say so, because a
        custom build of a solved problem is a maintenance liability with a nice
        launch. If you are still deciding whether to build at all, the{" "}
        <Link href="/insights/in-house-vs-agency-vs-freelancer">
          comparison of in-house, agency and freelance delivery
        </Link>{" "}
        is the more useful place to start than this page.
      </p>

      <h2>What we will and will not claim</h2>
      <p>
        Everything above is engineering and contracting practice, checkable
        against any honest vendor&rsquo;s process, including one that is not
        ours. What we will not do is dress it up in outcomes we have not
        published. EdgeBrain Studios is young: our{" "}
        <Link href="/work">three published case studies</Link> are exactly three,
        two of them labelled reference builds rather than named client
        engagements, and we are not inventing the rest of a portfolio to make an
        article more persuasive.
      </p>
      <p>
        The cheap way to test any of it is a paid two-week pilot: one real
        feature, our named people, your repository, your credentials, and a daily
        handoff you can read yourself. You own the code either way.{" "}
        <Link href="/contact">Send us the brief</Link> and we will tell you which
        of the three cases above you are in before we quote.
      </p>
    </ArticleLayout>
  );
}
